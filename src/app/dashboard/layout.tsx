'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import {
  Home,
  User,
  Building2,
  Image as ImageIcon,
  Clock,
  Settings,
  Package,
  FileText,
  Menu,
  Calendar,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [userType, setUserType] = useState<'user' | 'hospital' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is connected
    // if (!isConnected) {
    //   router.push('/');
    //   return;
    // }

    // In a real app, you would fetch the user type from your backend
    // For now, we'll check localStorage or default to 'user'
    const storedUserType = localStorage.getItem('userType') as 'user' | 'hospital' | null;
    setUserType(storedUserType || 'user');
  }, [isConnected, router]);

  // Common navigation items for all user types
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Hospitals', href: '/dashboard/hospitals', icon: Building2 },
    { name: 'NFTs', href: '/dashboard/nfts', icon: ImageIcon },
    { name: 'History', href: '/dashboard/history', icon: Clock },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Booking', href: '/dashboard/booking', icon: Calendar },
  ];

  // User-specific navigation items
  const userItems = [
    { name: 'Services', href: '/dashboard/services', icon: Package },
  ];

  // Hospital-specific navigation items
  const hospitalItems = [
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'Services', href: '/dashboard/services', icon: Package },
  ];

  // Combine navigation items based on user type
  const combinedNavItems = userType === 'hospital'
    ? navigationItems
    : [...navigationItems, ...userItems];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-blue-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/images/logo.svg" alt="Ataeru Logo" width={32} height={32} className="h-8 w-8" />
                  <span className="text-white text-xl font-semibold">Ataeru</span>
                </Link>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {combinedNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-100 hover:bg-blue-600'
                        }`}
                    >
                      {item.icon && (
                        <item.icon
                          className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                            }`}
                        />
                      )}
                      {item.name}
                    </Link>
                  );
                })}

                {userType === 'hospital' && (
                  <>
                    <div className="pt-2 mt-2 border-t border-blue-600">
                      <h3 className="px-3 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                        Hospital Management
                      </h3>
                    </div>
                    {hospitalItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                            ? 'bg-blue-800 text-white'
                            : 'text-blue-100 hover:bg-blue-600'
                            }`}
                        >
                          {item.icon && (
                            <item.icon
                              className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                                }`}
                            />
                          )}
                          {item.name}
                        </Link>
                      );
                    })}
                  </>
                )}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-blue-800 p-4">
              <div className="flex items-center w-full">
                <div className="w-full">
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
                                <div className="flex gap-2">
                                  <button
                                    onClick={openChainModal}
                                    className="text-sm bg-gray-100 text-gray-800 px-2 sm:px-5 py-2 rounded-full hover:bg-gray-200 flex items-center gap-2"
                                  >
                                    {chain.hasIcon && (
                                      <div
                                        style={{
                                          background: chain.iconBackground,
                                          width: 10,
                                          height: 10,
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
                                    {/* {chain.name} */}
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
                  </div>
                  {/* <ConnectButton showBalance={false} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} aria-hidden="true">
        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-72 transition duration-300 transform bg-blue-700 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-white" />
          </button>
        </div> */}
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.svg" alt="Ataeru Logo" width={32} height={32} className="h-8 w-8" />
              <span className="text-white text-xl font-semibold">Ataeru</span>
            </Link>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {combinedNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                    }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon && (
                    <item.icon
                      className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                        }`}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}

            {userType === 'hospital' && (
              <>
                <div className="pt-2 mt-2 border-t border-blue-600">
                  <h3 className="px-3 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Hospital Management
                  </h3>
                </div>
                {hospitalItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
                        }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.icon && (
                        <item.icon
                          className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                            }`}
                        />
                      )}
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
