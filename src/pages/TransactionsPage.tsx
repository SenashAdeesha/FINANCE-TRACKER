import { useState } from "react";
import PageLayout from "../components/PageLayout";
import Transactions from '../components/Transactions';

function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PageLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title="Transactions"
      hideContentTitle={true}
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Transactions />
      </div>
    </PageLayout>
  );
}

export default TransactionsPage;

