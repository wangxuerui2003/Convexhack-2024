import OptionCard from '@/components/OptionCard';
import { FaPersonMilitaryRifle } from 'react-icons/fa6';
import { GiCctvCamera } from 'react-icons/gi';

export default function Home() {
  return (
    <div className='text-center'>
      <h1 className='text-3xl font-bold mt-16'>Select the desired option</h1>
      <div className='flex justify-center items-center mt-12'>
        <div className='flex gap-10'>
          <OptionCard logo={GiCctvCamera} text='CCTV' href='/cctv' />
          <OptionCard
            logo={FaPersonMilitaryRifle}
            text='Your Tasks'
            href='/tasks'
          />
        </div>
      </div>
    </div>
  );
}