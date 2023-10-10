import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ALCHEMY_KEY } from "./env.ts";

const { chains, publicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: ALCHEMY_KEY })]
);
import { InjectedConnector } from "wagmi/connectors/injected";

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient: publicClient,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
