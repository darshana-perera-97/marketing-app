import AppLayout from '../../components/AppLayout';

export default function PurchaseCredits({ navigate, onLogout }) {
  return (
    <AppLayout navigate={navigate} onLogout={onLogout} activePage="purchase-credits">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Credentials</h1>
          <p className="text-gray-600">Manage your credentials and API access</p>
        </div>
      </div>
    </AppLayout>
  );
}

