import { WalletConnection } from "./components/WalletConnection";
import { DonationForm } from "./components/DonationForm";
import { WithdrawForm } from "./components/WithdrawForm";
import { ContractStats } from "./components/ContractStats";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WalletProvider } from "./contexts/WalletContext";

export default function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Header />

          <div className="max-w-6xl mx-auto space-y-8">
            <WalletConnection />

            <ContractStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DonationForm />

              <WithdrawForm />
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
}
