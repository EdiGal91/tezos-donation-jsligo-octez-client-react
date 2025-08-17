import { useState, useEffect, useRef } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";

const contractAddress = import.meta.env.VITE_CONTRACT;
const networkType = import.meta.env.VITE_NETWORK as NetworkType;
const rpcUrl = import.meta.env.VITE_RPC_URL;

export interface WalletState {
  address: string | null;
  balance: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  tezos: TezosToolkit | null;
  wallet: BeaconWallet | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    tezos: null,
    wallet: null,
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      initializeWallet();
    }
  }, []);

  const initializeWallet = async () => {
    try {
      const tezos = new TezosToolkit(rpcUrl);
      const wallet = new BeaconWallet({
        name: "Tezos Donation App",
        preferredNetwork: networkType,
      });

      tezos.setWalletProvider(wallet);

      setState((prev) => ({ ...prev, tezos, wallet }));

      // Check if already connected
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        // Re-set the wallet provider to ensure signer is configured
        tezos.setWalletProvider(wallet);

        const balance = await tezos.tz.getBalance(activeAccount.address);
        setState((prev) => ({
          ...prev,
          address: activeAccount.address,
          balance: balance.toNumber() / 1000000, // Convert from mutez to tez
          isConnected: true,
        }));
      }
    } catch (error) {
      console.error("Failed to initialize wallet:", error);
    }
  };

  const connectWallet = async () => {
    if (!state.wallet || !state.tezos) return;

    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      await state.wallet.requestPermissions({
        network: { type: networkType },
      });

      const activeAccount = await state.wallet.client.getActiveAccount();
      if (activeAccount) {
        // Re-set the wallet provider to ensure signer is configured
        state.tezos.setWalletProvider(state.wallet);

        const balance = await state.tezos.tz.getBalance(activeAccount.address);
        setState((prev) => ({
          ...prev,
          address: activeAccount.address,
          balance: balance.toNumber() / 1000000,
          isConnected: true,
          isConnecting: false,
        }));
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = async () => {
    if (!state.wallet) return;

    try {
      await state.wallet.client.clearActiveAccount();
      setState((prev) => ({
        ...prev,
        address: null,
        balance: null,
        isConnected: false,
      }));
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const refreshBalance = async () => {
    if (!state.tezos || !state.address) return;

    try {
      const balance = await state.tezos.tz.getBalance(state.address);
      setState((prev) => ({
        ...prev,
        balance: balance.toNumber() / 1000000,
      }));
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  };

  const donate = async (amount: number) => {
    if (!state.tezos || !state.address || !state.wallet)
      throw new Error("Wallet not connected");

    try {
      // Check if wallet is properly connected
      const activeAccount = await state.wallet.client.getActiveAccount();
      if (!activeAccount) {
        throw new Error("Wallet not properly connected. Please reconnect.");
      }

      // Use wallet's sendOperations method directly
      const operation = await state.wallet.sendOperations([
        {
          kind: "transaction",
          to: contractAddress,
          amount: Math.floor(amount * 1000000), // Convert to mutez
          parameter: {
            entrypoint: "donate",
            value: { prim: "Unit" },
          },
        },
      ]);

      // operation is already the hash string
      await refreshBalance();
      return operation;
    } catch (error) {
      console.error("Donation failed:", error);
      throw error;
    }
  };

  const withdraw = async (amount: number) => {
    if (!state.tezos || !state.address || !state.wallet)
      throw new Error("Wallet not connected");

    try {
      // Check if wallet is properly connected
      const activeAccount = await state.wallet.client.getActiveAccount();
      if (!activeAccount) {
        throw new Error("Wallet not properly connected. Please reconnect.");
      }

      // Use wallet's sendOperations method directly
      const operation = await state.wallet.sendOperations([
        {
          kind: "transaction",
          to: contractAddress,
          amount: 0, // No tez sent, just calling the function
          parameter: {
            entrypoint: "withdraw",
            value: { int: (amount * 1000000).toString() }, // Amount in mutez
          },
        },
      ]);

      // operation is already the hash string
      await refreshBalance();
      return operation;
    } catch (error) {
      console.error("Withdrawal failed:", error);
      throw error;
    }
  };

  const getContractInfo = async () => {
    if (!state.tezos) return null;

    try {
      const contract = await state.tezos.contract.at(contractAddress);
      const storage = (await contract.storage()) as any;

      return {
        owner: storage.owner,
        totalDonations: storage.total_donations.toNumber() / 1000000,
        contractBalance:
          (await state.tezos.tz.getBalance(contractAddress)).toNumber() /
          1000000,
      };
    } catch (error) {
      console.error("Failed to get contract info:", error);
      return null;
    }
  };

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    donate,
    withdraw,
    getContractInfo,
  };
};
