'use client';

import Cards from '@/components/cards';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const Tasks = () => {
  const tasks = useQuery(api.tasks.listTask);

  return (
    <div className='mx-auto p-4 flex justify-center bg-green-100'>
      <div>
        <h1 className='font-bold text-3xl md:text-5xl tracking-tight text-black py-10 text-center'>
          Tasks On-hand ✔️
        </h1>
        <div className='flex flex-col gap-3'>
          {tasks?.map((task) => (
            <Cards key={parseInt(task._id)} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
