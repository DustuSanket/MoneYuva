
import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src="https://placehold.co/40x40.png"
      alt="moneYuva logo"
      width={40}
      height={40}
      data-ai-hint="logo"
    />
  );
};

export default Logo;
