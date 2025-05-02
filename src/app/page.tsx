'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import FertilityAI from '@/components/FertilityAI';
import RegistrationModal from '@/components/RegistrationModal';
import MobileMenu from '@/components/MobileMenu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MouseEvent } from 'react';

export default function Home() {
  // const [userType, setUserType] = useState<string | null>(null);
  function handleScrollToSection(e: MouseEvent<HTMLAnchorElement>, sectionId: string): void {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // const { isOnboarded } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      {/* Navigation Bar */}
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

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      function handleWalletConnect() {
                        throw new Error('Function not implemented.');
                      }

                      return (
                        <button
                          onClick={() => {
                            openConnectModal();
                            handleWalletConnect();
                          }}
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
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <MobileMenu />
        </div>
      </nav>

      {/* 
      <RegistrationModal
      isOpen={isRegistrationModalOpen}
      onClose={() => setIsRegistrationModalOpen(false)}
      userType={userType}
      /> */}

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-24 max-xl:px-8 scroll-mt-20">
        <div className="relative mb-12 sm:mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Web3 Powered Fertility Care
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[4rem] font-bold leading-tight tracking-tight text-gray-900">
              <span className="text-blue-600">Decentralized</span> Family<br className="hidden sm:block" />
              Building Through<br className="hidden sm:block" />
              Smart Contracts
            </h1>
            <div className="mt-6 sm:mt-8">
              <p className="text-gray-600">Trusted by the community</p>
              <div className="flex gap-8 mt-4">
                <div>
                  <p className="font-semibold text-xl sm:text-2xl text-gray-800">15K+</p>
                  <p className="text-gray-600">Verified Donors</p>
                </div>
                <div>
                  <p className="font-semibold text-xl sm:text-2xl text-gray-800">$50M+</p>
                  <p className="text-gray-600">Total Value Locked</p>
                </div>
              </div>
            </div>
            <button
              className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full hover:opacity-90 flex items-center gap-2"
              onClick={() => {
                const element = document.getElementById('services');
                if (element) {
                  const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
                  window.scrollTo({
                    top: offsetTop - 80,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              Explore Services <span>↓</span>
            </button>
          </div>
          <div className="relative h-60 sm:h-80 md:h-auto mt-6 md:mt-0">
            <Image
              src="/images/hero-medical.png"
              alt="Medical Technology"
              width={600}
              height={400}
              className="rounded-2xl shadow-xl object-cover w-full h-full"
            />
            <div className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 bg-white p-3 sm:p-4 rounded-xl shadow-lg flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Image src="/images/ethereum.svg" alt="Ethereum" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold">Secure Transactions</p>
                <p className="text-xs text-gray-600">Ethereum Smart Contracts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div id="services" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scroll-mt-20">
          <a href="/services/sperm-donation" className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="aspect-[4/3] rounded-xl bg-white relative overflow-hidden">
              <Image src="/images/sperm-donation.jpg" alt="Sperm Donation" fill className="rounded-xl object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 sm:p-6">
                <div className="text-white">
                  <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Fertility Treatment</h3>
                  <p className="text-xs sm:text-sm text-white/90">Tokenized fertility treatments with transparent pricing.</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-0 scroll-mt-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-12">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Our services</h2>
              <p className="text-gray-600 max-w-xl text-sm sm:text-base">
                Web3-powered fertility solutions with smart contracts and blockchain verification
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Image src="/images/ethereum.svg" alt="Ethereum" width={24} height={24} />
              <Image src="/images/polygon.svg" alt="Polygon" width={24} height={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 sm:mb-16">
            {/* Donor Program */}
            <a href="/services/sperm-donation" className="bg-white rounded-2xl p-4 sm:p-6 group hover:shadow-md transition-all relative overflow-hidden cursor-pointer">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <h3 className="font-bold mb-1 text-gray-900">Sperm Donor Program</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Smart contract-backed donor verification.</p>
                </div>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </div>
              <div className="aspect-video bg-gray-50 rounded-xl relative">
                <Image src="/images/sperm-donation.jpg" alt="Donor Verification" fill className="rounded-xl object-cover" />
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-50 rounded-full">0.5 ETH</span>
                <span>Average Compensation</span>
              </div>
            </a>

            {/* Surrogacy Program */}
            <a href="/services/surrogacy" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-6 group hover:shadow-md transition-all relative overflow-hidden text-white cursor-pointer">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <h3 className="font-bold mb-1">Surrogacy Program</h3>
                  <p className="text-xs sm:text-sm text-white/90">Decentralized surrogate matching.</p>
                </div>
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </div>
              <div className="aspect-video bg-white/10 rounded-xl relative">
                <Image src="/images/surrogacy.jpg" alt="Surrogacy Matching" fill className="rounded-xl opacity-80 object-cover" />
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm">
                <span className="px-2 py-1 bg-white/20 rounded-full">Smart Escrow</span>
                <span>Protected Payments</span>
              </div>
            </a>

            {/* Fertility Treatments */}
            <a href="/services/fertility-treatment" className="bg-white rounded-2xl p-4 sm:p-6 group hover:shadow-md transition-all sm:col-span-2 lg:col-span-1 cursor-pointer">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <h3 className="font-bold mb-1 text-gray-900">Fertility Treatments</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Tokenized treatment packages.</p>
                </div>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </div>
              <div className="aspect-video bg-gray-50 rounded-xl relative">
                <Image src="/images/fertility-treatment.jpg" alt="Fertility Treatment" fill className="rounded-xl object-cover" />
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-50 rounded-full">NFT Based</span>
                <span>Treatment Tracking</span>
              </div>
            </a>
          </div>

          <div className="text-center">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-gray-900">
              BUILDING <span className="text-blue-600">FAMILIES</span> WITH<br className="hidden sm:block" />
              BLOCKCHAIN <span className="text-blue-600">TECHNOLOGY</span>
            </p>
            <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
              Dr. Sarah Johnson<br />
              Medical Director & Blockchain Advisor, LifeSpring
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />

      {/* AI Chat Widget */}
      <FertilityAI />

      {/* Registration Modal - will show automatically when wallet is connected and user is not onboarded */}
      <RegistrationModal />
    </div>
  );
}