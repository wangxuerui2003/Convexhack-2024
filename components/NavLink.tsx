import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

type NavLinkProps = {
  href: string;
  icon: IconType;
};

export default function NavLink({ href, icon: Logo }: NavLinkProps) {
  return (
    <Link href={href} className='px-3'>
      <Logo size={48} />
    </Link>
  );
}
