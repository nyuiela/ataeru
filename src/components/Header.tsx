'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MobileMenu from '@/components/MobileMenu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/app/contexts/use-auth';

interface HeaderProps {
  handleScrollToSection?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export default function Header({ handleScrollToSection }: HeaderProps) {
  const { isOnboarded, userType } = useAuth();
  const router = useRouter();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    }
  };

  // Use the prop if provided, otherwise use the local function
  const handleScroll = handleScrollToSection || scrollToSection;

  const handleLogoClick = () => {
    if (isOnboarded) {
      if (userType === 'user') {
        router.push('/ai/recommendations');
      } else if (userType === 'hospital') {
        router.push('/hospital/dashboard');
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="flex justify-between items-center max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
      <div className="flex items-center gap-10 sm:gap-12">
        <div 
          className="text-2xl text-blue-600 font-bold flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image src="/images/logo.svg" alt="LifeSpring Logo" width={32} height={32} className="w-8 h-8" />
          LifeSpring
        </div>
        
        {!isOnboarded ? (
          <div className="hidden lg:flex gap-6 sm:gap-8">
            <a href="#hero" className="text-sm hover:text-blue-600" onClick={(e) => handleScroll(e, 'hero')}>Home</a>
            <a href="#services" className="text-sm hover:text-blue-600" onClick={(e) => handleScroll(e, 'services')}>Services</a>
            <a href="#about" className="text-sm hover:text-blue-600" onClick={(e) => handleScroll(e, 'about')}>About Us</a>
          </div>
        ) : userType === 'user' ? (
          <div className="hidden lg:flex gap-6 sm:gap-8">
            <a href="/ai/recommendations" className="text-sm hover:text-blue-600">Recommendations</a>
            <a href="/donors" className="text-sm hover:text-blue-600">Donors</a>
            <a href="/surrogates" className="text-sm hover:text-blue-600">Surrogates</a>
          </div>
        ) : userType === 'hospital' ? (
          <div className="hidden lg:flex gap-6 sm:gap-8">
            <a href="/hospital/dashboard" className="text-sm hover:text-blue-600">Dashboard</a>
            <a href="/hospital/dashboard?tab=donors" className="text-sm hover:text-blue-600">Donors</a>
            <a href="/hospital/dashboard?tab=customers" className="text-sm hover:text-blue-600">Customers</a>
          </div>
        ) : null}
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        <MobileMenu />
        
        {!isOnboarded && (
          <a href="#resources" className="hidden lg:block text-sm hover:text-blue-600" onClick={(e) => handleScroll(e, 'resources')}>
            Resources
          </a>
        )}
        
        <ConnectButton />
      </div>
    </nav>
  );
}