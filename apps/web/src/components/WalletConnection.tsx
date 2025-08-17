import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useWalletContext } from "../contexts/WalletContext";

export const WalletConnection = () => {
  const {
    address,
    balance,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">
                {formatAddress(address)}
              </p>
              <p className="text-sm text-gray-600">{balance?.toFixed(6)} ꜩ</p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border text-center">
      <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Connect Your Wallet
      </h3>
      <p className="text-gray-600 mb-4">
        Connect Temple wallet to start donating
      </p>
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isConnecting ? "Connecting..." : "Connect Temple Wallet"}
      </button>
    </div>
  );
};
