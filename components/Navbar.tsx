import Link from 'next/link';
import AnimalGLogo from './AnimalGLogo';

export default function Navbar() {
  return (
    <div className='bg-[#ffffff80] w-screen flex items-center px-6 py-4 overflow-hidden'>
      <Link href='/'>
        <AnimalGLogo />
      </Link>
    </div>
  );
}
