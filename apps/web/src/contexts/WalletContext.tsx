import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useWallet } from "../hooks/useWallet";
import type { WalletState } from "../hooks/useWallet";

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  donate: (amount: number) => Promise<string>;
  withdraw: (amount: number) => Promise<string>;
  getContractInfo: () => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};
