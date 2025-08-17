import { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, RefreshCw } from "lucide-react";
import { useWalletContext } from "../contexts/WalletContext";

export const ContractStats = () => {
  const { getContractInfo, isConnected } = useWalletContext();
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadContractInfo();
    }
  }, [isConnected]);

  const loadContractInfo = async () => {
    setIsLoading(true);
    try {
      const info = await getContractInfo();
      setContractInfo(info);
    } catch (error) {
      console.error("Failed to load contract info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          Connect your wallet to view contract statistics
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Contract Statistics
          </h2>
        </div>
        <button
          onClick={loadContractInfo}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {contractInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Total Donations
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {contractInfo.totalDonations?.toFixed(6)} ꜩ
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Contract Balance
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {contractInfo.contractBalance?.toFixed(6)} ꜩ
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Contract Owner
                </p>
                <p className="text-sm font-mono text-purple-900 break-all">
                  {contractInfo.owner?.slice(0, 10)}...
                  {contractInfo.owner?.slice(-6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Contract Address</h3>
        <p className="font-mono text-sm text-gray-600 break-all">
          {import.meta.env.VITE_CONTRACT}
        </p>
        <a
          href={`https://ghostnet.tzkt.io/${
            import.meta.env.VITE_CONTRACT
          }/operations/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View on TzKT Explorer →
        </a>
      </div>
    </div>
  );
};
