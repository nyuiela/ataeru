import Image from 'next/image';
import FertilityAI from './components/FertilityAI';

export default function Home() {
   return (
      <div className="min-h-screen bg-white text-gray-800 relative">
         {/* Navigation Bar */}
         <nav className="flex justify-between items-center max-w-7xl mx-auto py-6 px-6">
            <div className="flex items-center gap-12">
               <div className="text-2xl text-blue-600 font-bold flex items-center gap-2">
                  <Image src="/images/logo.svg" alt="LifeSpring Logo" width={32} height={32} className="w-8 h-8" />
                  LifeSpring
               </div>
               <div className="flex gap-8">
                  <a href="#" className="text-sm hover:text-blue-600">Home</a>
                  <a href="#" className="text-sm hover:text-blue-600">Services</a>
                  <a href="#" className="text-sm hover:text-blue-600">About Us</a>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <a href="#" className="text-sm hover:text-blue-600">Resources</a>
               <button className="text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-full hover:opacity-90 flex items-center gap-2">
                  Connect Wallet <span>↗</span>
               </button>
            </div>
         </nav>

         {/* Hero Section */}
         <section className="max-w-7xl mx-auto px-6 mb-24 max-xl:px-10">
            <div className="relative mb-24 grid grid-cols-2 gap-12 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm mb-6">
                     <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                     Web3 Powered Fertility Care
                  </div>
                  <h1 className="text-[4rem] font-bold leading-tight tracking-tight text-gray-900">
                     <span className="text-blue-600">Decentralized</span> Family<br />
                     Building Through<br />
                     Smart Contracts
                  </h1>
                  <div className="mt-8">
                     <p className="text-gray-600">Trusted by the community</p>
                     <div className="flex gap-8 mt-4">
                        <div>
                           <p className="font-semibold text-2xl text-gray-800">15K+</p>
                           <p className="text-gray-600">Verified Donors</p>
                        </div>
                        <div>
                           <p className="font-semibold text-2xl text-gray-800">$50M+</p>
                           <p className="text-gray-600">Total Value Locked</p>
                        </div>
                     </div>
                  </div>
                  <button className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:opacity-90 flex items-center gap-2">
                     Launch dApp <span>↗</span>
                  </button>
               </div>
               <div className="relative">
                  <Image
                     src="/images/hero-medical.png"
                     alt="Medical Technology"
                     width={600}
                     height={400}
                     className="rounded-2xl shadow-xl object-cover w-full h-full"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Image src="/images/ethereum.svg" alt="Ethereum" width={24} height={24} className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold">Secure Transactions</p>
                        <p className="text-xs text-gray-600">Ethereum Smart Contracts</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-3 gap-8">
               <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[4/3] rounded-xl bg-white relative overflow-hidden">
                     <Image src="/images/sperm-donation.jpg" alt="Sperm Donation" fill className="rounded-xl object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                           <h3 className="font-bold text-xl mb-2">Sperm Donation</h3>
                           <p className="text-sm text-white/90">Blockchain-verified donation program with smart contract guarantees.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[4/3] rounded-xl bg-white relative overflow-hidden">
                     <Image src="/images/surrogacy.jpg" alt="Surrogacy" fill className="rounded-xl object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                           <h3 className="font-bold text-xl mb-2">Surrogacy</h3>
                           <p className="text-sm text-white/90">Decentralized surrogacy matching with secure payment escrow.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[4/3] rounded-xl bg-white relative overflow-hidden">
                     <Image src="/images/fertility-treatment.jpg" alt="Fertility Treatment" fill className="rounded-xl object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                           <h3 className="font-bold text-xl mb-2">Fertility Treatment</h3>
                           <p className="text-sm text-white/90">Tokenized fertility treatments with transparent pricing.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Services Section */}
         <section className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-[2rem] p-12">
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <h2 className="text-2xl font-bold mb-3 text-gray-900">Our Services</h2>
                     <p className="text-gray-600 max-w-xl">
                        Web3-powered fertility solutions with smart contracts and blockchain verification
                     </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <Image src="/images/ethereum.svg" alt="Ethereum" width={24} height={24} />
                     <Image src="/images/polygon.svg" alt="Polygon" width={24} height={24} />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 mb-16">
                  {/* Donor Program */}
                  <div className="bg-white rounded-2xl p-6 group hover:shadow-md transition-all relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="font-bold mb-1 text-gray-900">Sperm Donor Program</h3>
                           <p className="text-sm text-gray-600">Smart contract-backed donor verification.</p>
                        </div>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                     </div>
                     <div className="aspect-video bg-gray-50 rounded-xl relative">
                        <Image src="/images/sperm-donation.jpg" alt="Donor Verification" fill className="rounded-xl object-cover" />
                     </div>
                     <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-50 rounded-full">0.5 ETH</span>
                        <span>Average Compensation</span>
                     </div>
                  </div>

                  {/* Surrogacy Program */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 group hover:shadow-md transition-all relative overflow-hidden text-white">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="font-bold mb-1">Surrogacy Program</h3>
                           <p className="text-sm text-white/90">Decentralized surrogate matching.</p>
                        </div>
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                     </div>
                     <div className="aspect-video bg-white/10 rounded-xl relative">
                        <Image src="/images/surrogacy.jpg" alt="Surrogacy Matching" fill className="rounded-xl opacity-80 object-cover" />
                     </div>
                     <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-white/20 rounded-full">Smart Escrow</span>
                        <span>Protected Payments</span>
                     </div>
                  </div>

                  {/* Fertility Treatments */}
                  <div className="bg-white rounded-2xl p-6 group hover:shadow-md transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="font-bold mb-1 text-gray-900">Fertility Treatments</h3>
                           <p className="text-sm text-gray-600">Tokenized treatment packages.</p>
                        </div>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                     </div>
                     <div className="aspect-video bg-gray-50 rounded-xl relative">
                        <Image src="/images/fertility-treatment.jpg" alt="Fertility Treatment" fill className="rounded-xl object-cover" />
                     </div>
                     <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-50 rounded-full">NFT Based</span>
                        <span>Treatment Tracking</span>
                     </div>
                  </div>
               </div>

               <div className="text-center">
                  <p className="text-3xl font-bold leading-tight text-gray-900">
                     BUILDING <span className="text-blue-600">FAMILIES</span> WITH<br />
                     BLOCKCHAIN <span className="text-blue-600">TECHNOLOGY</span>
                  </p>
                  <p className="mt-6 text-gray-600">
                     Dr. Sarah Johnson<br />
                     Medical Director & Blockchain Advisor, LifeSpring
                  </p>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="max-w-7xl mx-auto mt-8 py-8 px-6 flex justify-between text-sm text-gray-600 border-t">
            <div>
               <p className="font-bold text-gray-800 mb-2">LifeSpring Fertility Center</p>
               <p>Licensed by the State Medical Board</p>
               <p>ISO 9001:2015 Certified</p>
               <p className="mt-2">Smart Contract Audited by CertiK</p>
            </div>
            <div className="text-right">
               <p>Contact: (555) 123-4567</p>
               <p>info@lifespring.eth</p>
               <div className="flex gap-2 mt-2 justify-end">
                  <Image src="/images/ethereum.svg" alt="Ethereum" width={20} height={20} />
                  <Image src="/images/polygon.svg" alt="Polygon" width={20} height={20} />
               </div>
            </div>
         </footer>

         {/* AI Chat Widget */}
         <FertilityAI />
      </div>
   );
}
