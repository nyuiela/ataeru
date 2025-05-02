"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { AuthProvider } from './use-auth';

const projectId = process.env.RAINBOW_KIT_PROJECT_ID
const RAINVOW_KIT_PROJECT_ID = `${projectId}`
const config = getDefaultConfig({
  appName: 'Ataeru',
  projectId: `${RAINVOW_KIT_PROJECT_ID}`,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowProvider;





// "use client"
// import '@rainbow-me/rainbowkit/styles.css';
// import {
//   getDefaultConfig,
//   RainbowKitProvider,
// } from '@rainbow-me/rainbowkit';
// import { WagmiProvider } from 'wagmi';
// import {
//   mainnet,
//   polygon,
//   optimism,
//   arbitrum,
//   base,
// } from 'wagmi/chains';
// import {
//   QueryClientProvider,
//   QueryClient,
// } from "@tanstack/react-query";

// const config = getDefaultConfig({
//   appName: 'My RainbowKit App',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [mainnet, polygon, optimism, arbitrum, base],
//   ssr: true, // If your dApp uses server side rendering (SSR)
// });


// const queryClient = new QueryClient();
// const RainbowProvider = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>
//           {children}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// };

// export default RainbowProvider