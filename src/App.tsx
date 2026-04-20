import { useState } from 'react';
import { AuthGate } from './components/AuthGate';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TransactionsTable } from './components/TransactionsTable';
import { Categories } from './components/Categories';
import { Goals } from './components/Goals';
import { RecurringTransactions } from './components/RecurringTransactions';
import { Accounts } from './components/Accounts';
import { CreditCards } from './components/CreditCards';
import { Insights } from './components/Insights';
import { Loans } from './components/Loans';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'transactions' && <TransactionsTable />}
      {activeTab === 'loans' && <Loans />}
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
    <AuthProvider>
      <AuthGate>
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
