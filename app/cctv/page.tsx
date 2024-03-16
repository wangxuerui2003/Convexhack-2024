'use client';

import { useQuery, useMutation } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { FiTarget } from 'react-icons/fi';
import { CircleLoader } from 'react-spinners';
import { api } from '@/convex/_generated/api';
import html2canvas from 'html2canvas';

function isAnimal(detection: string): boolean {
  return (
    detection === 'bird' ||
    detection === 'cat' ||
    detection === 'dog' ||
    detection === 'horse' ||
    detection === 'sheep' ||
    detection === 'cow' ||
    detection === 'elephant' ||
    detection === 'bear' ||
    detection === 'zebra' ||
    detection === 'giraffe'
  );
}

async function getCityFromCoordinates(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();
    return `${data.address.road !== undefined ? data.address.road + ', ' : ''}${
      data.address.suburb
    }, ${data.address.city}`;
  } catch (error) {
    console.error('Error getting city from coordinates:', error);
    return '';
  }
}

export default function AnimalDetection() {
  const videoRef: any = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const addTask = useMutation(api.tasks.addTask);
  const generateUploadUrl = useMutation(api.tasks.generateUploadUrl);

  useEffect(() => {
    const runObjectDetection = async () => {
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      video.srcObject = stream;
      await video.play();

      const model = await cocoSsd.load();
      setInterval(async () => {
        const predictions = await model.detect(video);
        processPredictions(predictions);
      }, 10000);
      setLoading(false);
    };

    runObjectDetection();
  }, []);

  const createTask = async (
    taskAddress: string,
    taskLocation: GeolocationCoordinates
  ) => {
    if (!videoRef.current) {
      return;
    }

    const screenshotCanvas = await html2canvas(videoRef.current);
    screenshotCanvas.toBlob(async (blob) => {
      if (!blob) {
        return;
      }

      // save canvas screenshot to a file object
      const screenshotFile = new File([blob], 'screenshot.png', {
        type: 'image/png',
      });

      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': screenshotFile.type },
        body: screenshotFile,
      });

      const { storageId } = await result.json();

      await addTask({
        location: {
          latitude: taskLocation.latitude,
          longitude: taskLocation.longitude,
        },
        address: taskAddress,
        imageStorageId: storageId,
      });

      console.log('Task created');
    }, 'image/png');
  };

  const processPredictions = (predictions: cocoSsd.DetectedObject[]) => {
    const video = videoRef.current;
    const canvas: any = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas?.getContext('2d');

    if (!context) {
      console.error('Failed to get 2D context for canvas');
      return;
    }

    const { videoWidth, videoHeight } = video as HTMLVideoElement;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    let taskCreated: boolean = false;

    predictions.forEach((prediction: cocoSsd.DetectedObject) => {
      if (taskCreated === true) {
        return;
      }

      const { class: className, score, bbox } = prediction;

      if (!isAnimal(className)) {
        return;
      }

      console.log('No way');

      taskCreated = true;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const taskAddress = await getCityFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );

          await createTask(taskAddress, position.coords);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );

      // draw the rectangle around the object
      const [x, y, width, height] = bbox;
      context.beginPath();
      context.rect(x, y, width, height);
      context.lineWidth = 2;
      context.strokeStyle = 'rgba(0, 0, 256, 0.8)';
      context.fillStyle = 'rgba(0, 0, 256, 0.2)';
      context.stroke();
      context.fill();
      context.fillStyle = 'white';
      context.fillText(
        `Animal ${Math.round(score * 100)}%`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };

  return (
    <div className='mx-auto p-4 flex justify-center bg-green-100 overflow-hidden'>
      <div>
        <h1 className='font-bold text-3xl md:text-5xl tracking-tight text-black text-center'>
          Detecting Animals ⚠️
        </h1>
        <p className='text-center text-slate-500 py-5'>
          You will receive notification in your task after a 10-second interval
          following the animal's period of remaining stationary
        </p>
        <div className='flex flex-col bg-opacity-80'>
          <div className='relative'>
            {loading && (
              <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                <CircleLoader color='#33d44e' size={80} />
              </div>
            )}
            <video
              ref={videoRef}
              className='w-min h-auto rounded-lg shadow-xl object-contain mx-auto'
            />
            <canvas
              ref={canvasRef}
              className='absolute top-0 left-0 w-full h-full'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
