import { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TransactionsTable } from './components/TransactionsTable';
import { Categories } from './components/Categories';
import { Goals } from './components/Goals';
import { RecurringTransactions } from './components/RecurringTransactions';
import { Accounts } from './components/Accounts';
import { CreditCards } from './components/CreditCards';
import { Insights } from './components/Insights';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'transactions' && <TransactionsTable />}
      {activeTab === 'accounts' && <Accounts />}
      {activeTab === 'credit-cards' && <CreditCards />}
      {activeTab === 'insights' && <Insights />}
      {activeTab === 'recurring' && <RecurringTransactions />}
      {activeTab === 'categories' && <Categories />}
      {activeTab === 'goals' && <Goals />}
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
