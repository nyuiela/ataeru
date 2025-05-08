'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/use-auth';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isOnboarded } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // const handleNavigation = (path: string) => {
  //   router.push(path);
  //   closeMenu();
  // };

  const scrollToSection = (sectionId: string) => {
    closeMenu();
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - 80, // Adjust for header height
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center h-10 w-10 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-xl font-bold text-blue-600">Ataeru</div>
            <button
              onClick={closeMenu}
              className="flex items-center justify-center h-10 w-10 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-4">
              {!isOnboarded ? (
                <>
                  <li>
                    <button
                      onClick={() => scrollToSection('hero')}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('services')}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      Services
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('about')}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('resources')}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      Resources
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      User Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/hospital/dashboard')}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                    >
                      Hospital Dashboard
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={() => {
                // Sign Out Logic
                localStorage.removeItem('userType');
                localStorage.removeItem('isOnboarded');
                localStorage.removeItem('isHospitalVerified');
                window.location.href = '/';
                closeMenu();
              }}
              className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}