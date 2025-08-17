export const Footer = () => {
  return (
    <div className="text-center py-8 border-t border-gray-200">
      <p className="text-gray-600">
        Built with Tezos, LIGO, and React. Open source and decentralized.
      </p>
      <div className="mt-2 text-sm text-gray-500">
        Contract: {import.meta.env.VITE_CONTRACT}
      </div>
    </div>
  );
};
