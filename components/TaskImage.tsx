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
      className='rounded-t-lg h-max md:w-48 md:rounded-none md:rounded-s-lg'
      src={imageUrl}
      alt='task image'
    />
  );
}
