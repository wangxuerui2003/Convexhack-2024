import OptionCard from '@/components/OptionCard';
import { FaPersonMilitaryRifle } from 'react-icons/fa6';
import { GiCctvCamera } from 'react-icons/gi';

export default function Home() {
  return (
    <div className='text-center'>
      <h1 className='font-bold text-3xl md:text-5xl tracking-tight text-black py-10 text-center'>
        Select the desired option
      </h1>
      <div className='flex justify-center items-center'>
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
