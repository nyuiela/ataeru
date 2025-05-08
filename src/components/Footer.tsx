'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="about" className="max-w-7xl mx-auto mt-8 py-6 sm:py-8 px-4 sm:px-6 flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 border-t border-gray-200 gap-6 sm:gap-0 scroll-mt-20">
      <div>
        <p className="font-bold text-gray-800 mb-2">Ataeru Fertility Center</p>
        <p>Licensed by the State Medical Board</p>
        <p>ISO 9001:2015 Certified</p>
        <p className="mt-2">Smart Contract Audited by CertiK</p>
      </div>
      <div className="text-left sm:text-right">
        <p>Contact: (555) 123-4567</p>
        <p>info@Ataeru.eth</p>
        <div className="flex gap-2 mt-2 justify-start sm:justify-end">
          <Image src="/images/ethereum.svg" alt="Ethereum" width={20} height={20} />
          <Image src="/images/polygon.svg" alt="Polygon" width={20} height={20} />
        </div>
      </div>
    </footer>
  );
}