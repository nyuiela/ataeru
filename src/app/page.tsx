import Image from 'next/image';

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
                     className="rounded-2xl shadow-xl"
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
                  <div className="aspect-[4/3] rounded-xl bg-white flex items-center justify-center p-6 relative overflow-hidden">
                     <Image src="/images/sperm-donation.jpg" alt="Sperm Donation" layout="fill" objectFit="cover" className="rounded-xl" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                           <h3 className="font-bold text-xl mb-2">Sperm Donation</h3>
                           <p className="text-sm text-white/90">Blockchain-verified donation program with smart contract guarantees.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[4/3] rounded-xl bg-white flex items-center justify-center p-6 relative overflow-hidden">
                     <Image src="/images/surrogacy.jpg" alt="Surrogacy" layout="fill" objectFit="cover" className="rounded-xl" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div className="text-white">
                           <h3 className="font-bold text-xl mb-2">Surrogacy</h3>
                           <p className="text-sm text-white/90">Decentralized surrogacy matching with secure payment escrow.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[4/3] rounded-xl bg-white flex items-center justify-center p-6 relative overflow-hidden">
                     <Image src="/images/fertility.jpg" alt="Fertility Treatment" layout="fill" objectFit="cover" className="rounded-xl" />
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
                        <Image src="/images/donor-verify.jpg" alt="Donor Verification" layout="fill" objectFit="cover" className="rounded-xl" />
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
                        <Image src="/images/surrogacy-match.jpg" alt="Surrogacy Matching" layout="fill" objectFit="cover" className="rounded-xl opacity-80" />
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
                        <Image src="/images/fertility-treatment.jpg" alt="Fertility Treatment" layout="fill" objectFit="cover" className="rounded-xl" />
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
         <footer className="max-w-7xl mx-auto mt-8 py-8 px-6 flex justify-between text-sm text-gray-600 border-t mt-20">
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
         <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group">
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xl">AI</span>
                     </div>
                     <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  </div>
                  <span className="font-medium">Chat with FertilityAI</span>
               </div>
            </button>

            {/* Chat Interface (Initially Hidden - Add state management for toggle) */}
            <div className="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
               {/* Chat Header */}
               <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xl">AI</span>
                     </div>
                     <div>
                        <h3 className="font-bold">FertilityAI Assistant</h3>
                        <p className="text-sm text-blue-100">Online | Typical reply in 2s</p>
                     </div>
                  </div>
               </div>

               {/* Chat Messages */}
               <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {/* AI Message */}
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                        AI
                     </div>
                     <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm">
                           Hello! I'm your FertilityAI assistant. I can help you with:
                           <ul className="mt-2 space-y-1 list-disc list-inside">
                              <li>Understanding our fertility services</li>
                              <li>Explaining Web3 integration</li>
                              <li>Donor program information</li>
                              <li>Smart contract details</li>
                              <li>Treatment costs and packages</li>
                           </ul>
                           How can I assist you today?
                        </div>
                     </div>
                  </div>

                  {/* Example User Message */}
                  <div className="flex gap-3 justify-end">
                     <div className="flex-1 max-w-[80%]">
                        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-4 text-sm">
                           How does the blockchain verify sperm donors?
                        </div>
                     </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                        AI
                     </div>
                     <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm">
                           Our blockchain verification process includes:
                           <ul className="mt-2 space-y-1 list-disc list-inside">
                              <li>Secure identity verification through zkProofs</li>
                              <li>Immutable medical record tracking</li>
                              <li>Smart contract-based compensation</li>
                              <li>Transparent donation history</li>
                           </ul>
                           Would you like me to explain any of these in detail?
                        </div>
                     </div>
                  </div>
               </div>

               {/* Chat Input */}
               <div className="p-4 border-t">
                  <div className="flex gap-2">
                     <input
                        type="text"
                        placeholder="Type your question..."
                        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-600"
                     />
                     <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                     </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                     Your conversation is private and encrypted. Medical advice is for information only.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
