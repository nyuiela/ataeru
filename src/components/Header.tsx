'use client';
import Image from 'next/image';
import MobileMenu from '@/components/MobileMenu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import RegistrationModal from './RegistrationModal';
// import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';

interface HeaderProps {
  handleScrollToSection?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export default function Header({ handleScrollToSection }: HeaderProps) {
  // const router = useRouter();
  const { isConnected } = useAccount();

  // const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  //   e.preventDefault();
  //   const targetElement = document.getElementById(targetId);
  //   if (targetElement) {
  //     const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
  //     window.scrollTo({
  //       top: offsetTop - 80, // Adjust for header height
  //       behavior: 'smooth'
  //     });
  //   }
  // };

  // Use the prop if provided, otherwise use the local function
  // const handleScroll = handleScrollToSection || scrollToSection;

  // const handleLogoClick = () => {
  //   if (isOnboarded) {
  //     if (userType === 'user') {
  //       router.push('/ai/recommendations');
  //     } else if (userType === 'hospital') {
  //       router.push('/hospital/dashboard');
  //     } else {
  //       router.push('/');
  //     }
  //   } else {
  //     router.push('/');
  //   }
  // };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-12">
          <div className="text-2xl text-blue-600 font-bold flex items-center gap-2">
            <Image src="/images/logo.svg" alt="Ataeru Logo" width={32} height={32} className="w-8 h-8" />
            Ataeru
          </div>
          <div className="hidden lg:flex gap-6 sm:gap-8">
            <a href="#hero" className="text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection?.(e, 'hero')}>Home</a>
            <a href="#services" className="text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection?.(e, 'services')}>Services</a>
            <a href="#about" className="text-sm hover:text-blue-600" onClick={(e) => handleScrollToSection?.(e, 'about')}>About Us</a>
            {isConnected && (
              <Link href='/dashboard' prefetch className="text-sm hover:text-blue-600">
                Dashboard
              </Link>
            )}
            {isConnected && (
              <Link href='/booking' prefetch className="text-sm hover:text-blue-600">
                Booking
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              if (!ready) {
                return (
                  <div
                    aria-hidden="true"
                    style={{
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  />
                );
              }

              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-5 py-2 rounded-full hover:opacity-90 flex items-center gap-2"
                  >
                    Connect Wallet <span>↗</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="text-sm bg-red-500 text-white px-4 sm:px-5 py-2 rounded-full hover:opacity-90"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex gap-3">
                  <button
                    onClick={openChainModal}
                    className="text-sm bg-gray-100 text-gray-800 px-4 sm:px-5 py-2 rounded-full hover:bg-gray-200 flex items-center gap-2"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="text-sm bg-gray-100 text-gray-800 px-4 sm:px-5 py-2 rounded-full hover:bg-gray-200"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            }}
          </ConnectButton.Custom>
          <MobileMenu />
        </div>
      </nav>

      {/* Registration Modal */}
      <RegistrationModal />

    </>
  );
}