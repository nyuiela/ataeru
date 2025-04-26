'use client';

import Image from 'next/image';
import MobileMenu from '@/components/MobileMenu';

interface HeaderProps {
  handleScrollToSection: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export default function Header({ handleScrollToSection }: HeaderProps) {
  return (
    <nav className="flex justify-between items-center max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
      <div className="flex items-center gap-4 sm:gap-12">
        <div className="text-2xl text-blue-600 font-bold flex items-center gap-2">
          <Image src="/images/logo.svg" alt="LifeSpring Logo" width={32} height={32} className="w-8 h-8" />
          LifeSpring
        </div>
        <div className="hidden lg:flex gap-6 sm:gap-8">
          <a href="#hero" className="text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection(e, 'hero')}>Home</a>
          <a href="#services" className="text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection(e, 'services')}>Services</a>
          <a href="#about" className="text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection(e, 'about')}>About Us</a>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <MobileMenu />
        <a href="#resources" className="hidden lg:block text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection(e, 'resources')}>Resources</a>
        <button className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-5 py-2 rounded-full hover:opacity-90 flex items-center gap-2">
          Connect Wallet <span>↗</span>
        </button>
      </div>
    </nav>
  );
}