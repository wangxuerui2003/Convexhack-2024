import { Id } from '@/convex/_generated/dataModel';

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

export default function TaskImage({ imageUrl }: Task) {
  return (
    <img
      className='h-max md:w-48 rounded'
      src={imageUrl}
      alt='task image'
    />
  );
}
