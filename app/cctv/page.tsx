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

const ObjectDetection = () => {
  const currentDate = new Date();
  const videoRef: any = useRef(null);
  const canvasRef = useRef(null);
  const [predictions, setPredictions]: any[] = useState([]);
  const [loading, setLoading] = useState(true);
  const addTask = useMutation(api.tasks.send);
  const generateUploadUrl = useMutation(api.tasks.generateUploadUrl);

  // coordinates
  const [currentCoordinates, setcurrentCoordinates] =
    useState<GeolocationCoordinates | null>(null);

  // location
  const [currentCity, setCurrentCity] = useState('');

  useEffect(() => {
    const runObjectDetection = async () => {
      setLoading(true);
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      video.srcObject = stream;
      await video.play();

      const model = await cocoSsd.load();
      setInterval(async () => {
        const predictions = await model.detect(video);
        setPredictions(predictions);
        drawBoundingBoxes(predictions);
      }, 5000);
      setLoading(false);
    };

    runObjectDetection();
  }, []);

  const drawBoundingBoxes = (predictions: cocoSsd.DetectedObject[]) => {
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

    predictions.forEach((prediction: cocoSsd.DetectedObject) => {
      const { class: className, score, bbox } = prediction;

      if (!isAnimal(className)) {
        return;
      }

      const fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setcurrentCoordinates(position.coords);
            console.log(position.coords); // getting the coordinates
            const city = await getCityFromCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            setCurrentCity(city);
            console.log(city); // getting the city address

            console.log("currentDate: ")
            console.log(currentDate)


            console.log("currentDate: ")
            console.log(typeof currentDate);

            if (!videoRef.current) {
              return;
            }

            const screenshotCanvas = await html2canvas(videoRef.current);
            screenshotCanvas.toBlob(async (blob) => {
              if (blob) {
                // Create a File object from the Blob
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
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                  address: city,
                  imageStorageId: storageId,
                });
              }
            }, 'image/png');
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      };

      const getCityFromCoordinates = async (latitude: any, longitude: any) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          return `${data.address.road}, ${data.address.suburb}, ${data.address.city}`;
        } catch (error) {
          console.error('Error getting city from coordinates:', error);
          return '';
        }
      };
      fetchLocation();

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
    <div className='mx-auto p-4 flex justify-center bg-green-100'>
      <div>
        <h1 className='font-bold text-3xl md:text-5xl tracking-tight text-black py-10 text-center'>
          Detecting Animals ⚠️
        </h1>
        <div className='flex flex-col bg-opacity-80'>
          <div className='relative'>
            {loading && (
              <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                <CircleLoader color='#33d44e' size={80} />
              </div>
            )}
            <video
              ref={videoRef}
              className='w-full max-w-4xl rounded-lg shadow-xl my-5'
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
};

export default ObjectDetection;