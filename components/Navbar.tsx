import Link from 'next/link';
import AnimalGLogo from './AnimalGLogo';

export default function Navbar() {
  return (
    <div className='bg-white w-screen h-14 flex items-center px-6 py-3 overflow-hidden'>
      <Link href='/'>
        <AnimalGLogo />
      </Link>
    </div>
  );
}
