// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState, useEffect, useRef } from 'react';

// export default function MobileMenu() {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
//     e.preventDefault();
//     setIsOpen(false);

//     const targetElement = document.getElementById(targetId);
//     if (targetElement) {
//       const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
//       window.scrollTo({
//         top: offsetTop - 80, // Adjust for header height
//         behavior: 'smooth'
//       });
//     }
//   };

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     // Only add the event listener when the menu is open
//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen]);

//   return (
//     <div className="hidden sm:block lg:hidden" ref={menuRef}>
//       {/* Hamburger Button */}
//       <button
//         onClick={toggleMenu}
//         className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
//         aria-label="Toggle mobile menu"
//       >
//         <span className={`block w-6 h-0.5 bg-blue-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
//         <span className={`block w-6 h-0.5 bg-blue-600 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
//         <span className={`block w-6 h-0.5 bg-blue-600 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
//       </button>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div
//           className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300"
//         >
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="font-bold text-xl">Menu</h2>
//             <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <div className="flex flex-col space-y-4">
//             <a href="#hero" onClick={() => router.push('/dashboard')}>
//               <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Dashboard</div>
//             </a>
//             <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')}>
//               <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Home</div>
//             </a>
//             <div className="border-b border-gray-200 my-1"></div>
//             <a href="#services" onClick={(e) => handleNavClick(e, 'services')}>
//               <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">Services</div>
//             </a>
//             <div className="border-b border-gray-200 my-1"></div>
//             <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>
//               <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">About</div>
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }