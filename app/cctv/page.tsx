'use client'

import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { FiTarget } from 'react-icons/fi';
import { CircleLoader } from 'react-spinners';

const ObjectDetection = () => {
  const videoRef: any = useRef(null);
  const canvasRef = useRef(null);
  const [predictions, setPredictions]: any[] = useState([]);
  const [loading, setLoading] = useState(true);

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
      }, 1000);
      setLoading(false);
    };

    runObjectDetection();
  }, []);

  const drawBoundingBoxes = (predictions: any) => {
    const video = videoRef.current;
    const canvas: any = canvasRef.current;
    const context = canvas.getContext('2d');
  
    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    predictions.forEach((prediction: any) => {
      const [x, y, width, height] = prediction.bbox;
      context.beginPath();
      context.rect(x, y, width, height);
      context.lineWidth = 2;
      context.strokeStyle = 'rgba(0, 0, 256, 0.8)';
      context.fillStyle = 'rgba(0, 0, 256, 0.2)';
      context.stroke();
      context.fill();
      context.fillStyle = 'white';
      context.fillText(
        `${prediction.class} ${Math.round(prediction.score * 100)}%`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };  

  return (
    <div className="flex flex-col bg-opacity-80">
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <CircleLoader color="#ff00ff" size={80} />
        </div>
      )}
      <video ref={videoRef} className="w-full max-w-4xl rounded-lg shadow-xl my-5" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
      <div className="flex justify-center">
        <div className="bg-white bg-opacity-40 rounded-lg shadow-lg my-10 w-4/5">
          {predictions.map((prediction: any, index: number) => (
            <div key={index} className="py-2 px-5">
              <p className="text-lg font-bold flex gap-2 items-center">{prediction.class}</p>
              <p className="flex gap-2 items-center">
                <FiTarget /> Accuracy: {Math.round(prediction.score * 100)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObjectDetection;