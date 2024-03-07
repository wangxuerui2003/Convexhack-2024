import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

interface IOptionCard {
  logo: IconType;
  text: string;
  href: string;
}

export default function OptionCard({ logo: Logo, text, href }: IOptionCard) {
  return (
    <Link
      href={href}
      className='bg-[#fff7f1] w-64 h-64 flex flex-col justify-center items-center rounded-2xl hover:bg-[#eee6e0]'
    >
      <Logo size={108} />
      <h2 className='text-2xl font-bold'>{text}</h2>
    </Link>
  );
}
