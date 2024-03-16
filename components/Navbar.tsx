import Link from 'next/link';
import AnimalGLogo from './AnimalGLogo';
import NavLink from './NavLink';
import { GiCctvCamera } from 'react-icons/gi';
import { FaPersonMilitaryRifle } from 'react-icons/fa6';

export default function Navbar() {
  return (
    <div className='bg-[#ffffff80] w-screen flex justify-between items-center px-6 py-2 overflow-hidden'>
      <div>
        <Link href='/'>
          <AnimalGLogo />
        </Link>
      </div>
      <div className='flex gap-5'>
        <NavLink href='/cctv' icon={GiCctvCamera} />
        <NavLink href='/tasks' icon={FaPersonMilitaryRifle} />
      </div>
    </div>
  );
}
