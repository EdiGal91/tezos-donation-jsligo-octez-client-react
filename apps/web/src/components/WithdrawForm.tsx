import { useState, useEffect } from "react";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import { useWalletContext } from "../contexts/WalletContext";

export const WithdrawForm = () => {
  const { address, isConnected, withdraw, getContractInfo } =
    useWalletContext();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadContractInfo();
  }, [address]);

  const loadContractInfo = async () => {
    try {
      const info = await getContractInfo();
      setContractInfo(info);
      setIsOwner(address === info?.owner);
    } catch (error) {
      console.error("Failed to load contract info:", error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setMessage("");

    try {
      const opHash = await withdraw(parseFloat(amount));
      setMessage(`Withdrawal successful! Transaction: ${opHash}`);
      setAmount("");
      await loadContractInfo();
    } catch (error: any) {
      setMessage(`Withdrawal failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect your wallet to withdraw funds</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Access Restricted</h3>
        </div>
        <p className="text-yellow-700">
          Only the contract owner can withdraw funds.
        </p>
        {contractInfo && (
          <p className="text-sm text-yellow-600 mt-2">
            Owner: {contractInfo.owner}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
      </div>

      {contractInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">
            Contract Information
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Total Donations: {contractInfo.totalDonations?.toFixed(6)} ꜩ</p>
            <p>
              Contract Balance: {contractInfo.contractBalance?.toFixed(6)} ꜩ
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleWithdraw} className="space-y-4">
        <div>
          <label
            htmlFor="withdraw-amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount (ꜩ)
          </label>
          <input
            type="number"
            id="withdraw-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            step="0.000001"
            min="0.000001"
            max={contractInfo?.contractBalance || 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          />
          {contractInfo && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum: {contractInfo.contractBalance?.toFixed(6)} ꜩ
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              setAmount((contractInfo?.contractBalance / 2)?.toFixed(6) || "")
            }
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading || !contractInfo?.contractBalance}
          >
            Half
          </button>
          <button
            type="button"
            onClick={() =>
              setAmount(contractInfo?.contractBalance?.toFixed(6) || "")
            }
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading || !contractInfo?.contractBalance}
          >
            All
          </button>
        </div>

        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          {isLoading ? "Processing..." : "Withdraw"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            message.includes("successful")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};
