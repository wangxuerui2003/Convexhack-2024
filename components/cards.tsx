'use client';

import { Id } from '@/convex/_generated/dataModel';
import TaskImage from './TaskImage';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FaLocationDot } from 'react-icons/fa6';
import { TiTickOutline } from 'react-icons/ti';
import { MdTimer } from 'react-icons/md';
import { useEffect, useState } from 'react';

type Task = {
  _id: Id<'tasks'>;
  _creationTime: number;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  imageStorageId: Id<'_storage'>;
  imageUrl: string;
};

export default function Cards(task: Task) {
  const deleteTask = useMutation(api.tasks.deleteTask);
  const deleteImageById = useMutation(api.images.deleteById);
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  useEffect(() => {
    const timerID: NodeJS.Timeout = setInterval(
      () => setTimestamp(new Date().getTime()),
      1000
    );

    return () => {
      clearInterval(timerID);
    };
  }, []);

  // Function to convert milliseconds to minutes, hours, or days ago
  const timeAgo = (currentTimestamp: number): string => {
    const difference = currentTimestamp - task._creationTime;

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className='flex flex-col items-center md:flex-row md:max-w-xl relative overflow-hidden rounded-lg border border-gray-300 bg-white p-4 shadow-md mx-7'>
      <TaskImage {...task} />

      <div className='flex flex-col justify-between ml-4'>
        <h5 className='font-bold text-black mb-2 flex gap-2 items-center'>
          <span className='text-3xl'>
            <FaLocationDot />
          </span>{' '}
          {task.address}
        </h5>
        <div className='flex flex-col space-y-2'>
          <div className='text-sm text-gray-500'>
            <span className='font-semibold'>Latitude:</span>{' '}
            {task.location.latitude}
          </div>
          <div className='text-sm text-gray-500'>
            <span className='font-semibold'>Longitude:</span>{' '}
            {task.location.longitude}
          </div>

          <p className='text-xs text-gray-400 flex items-center'>
            <MdTimer /> : {timeAgo(timestamp)}
          </p>
        </div>
        <div className='flex justify-end'>
          <button
            className='mx-2 px-2 py-2 bg-black text-white rounded hover:bg-green-100 hover:text-black flex-shrink-0'
            onClick={() => {
              deleteImageById({ storageId: task.imageStorageId });
              deleteTask({ id: task._id });
            }}
          >
            <TiTickOutline />
          </button>
        </div>
      </div>
    </div>
  );
}
