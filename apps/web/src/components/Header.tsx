import { Heart } from "lucide-react";

export const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Heart className="w-10 h-10 text-red-500" />
        <h1 className="text-4xl font-bold text-gray-900">Tezos Donation App</h1>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Support our cause by donating Tezos. Every contribution makes a
        difference.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        Connected to Ghostnet Testnet
      </div>
    </div>
  );
};
