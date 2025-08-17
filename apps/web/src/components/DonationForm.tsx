import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useWalletContext } from "../contexts/WalletContext";

export const DonationForm = () => {
  const { isConnected, donate } = useWalletContext();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const predefinedAmounts = [0.1, 0.5, 1, 5];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setMessage("");

    try {
      const opHash = await donate(parseFloat(amount));
      setMessage(`Donation successful! Transaction: ${opHash}`);
      setAmount("");
    } catch (error: any) {
      setMessage(`Donation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect your wallet to make a donation</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">Make a Donation</h2>
      </div>

      <form onSubmit={handleDonate} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount (ꜩ)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in tez"
            step="0.000001"
            min="0.000001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Quick amounts:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {predefinedAmounts.map((preAmount) => (
              <button
                key={preAmount}
                type="button"
                onClick={() => setAmount(preAmount.toString())}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={isLoading}
              >
                {preAmount} ꜩ
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
          {isLoading ? "Processing..." : "Donate"}
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
