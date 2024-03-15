import { Id } from '@/convex/_generated/dataModel';
import TaskImage from './TaskImage';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

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

  console.log(task);
  return (
    <div className='flex flex-col items-center border-gray-300 md:flex-row md:max-w-xl relative overflow-hidden rounded-lg border bg-white p-2 shadow mx-7'>
      <TaskImage {...task} />
      <div className='flex flex-col justify-between p-4 leading-normal'>
        <h5 className='font-bold text-black '>{task.address}</h5>
        <div>
          <p className='text-sm text-gray-500'>
            Latitude: {task.location.latitude}
          </p>
          <p className='text-sm text-gray-500'>
            Longitude: {task.location.longitude}
          </p>
          <p className='text-xs text-gray-400 pt-5'>
            {new Date(task._creationTime).toString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          deleteImageById({ storageId: task.imageStorageId });
          deleteTask({ id: task._id });
        }}
      >
        Finish Task
      </button>
    </div>
  );
}
