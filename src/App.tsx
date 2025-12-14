import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrapPage } from './pages/ScrapPage';
import { PlanPage } from './pages/PlanPage';
import { CheckPage } from './pages/CheckPage';
import { MemoryPage } from './pages/MemoryPage';
import { WalletPage } from './pages/WalletPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { TripProvider, useTrip } from './context/TripContext';

function AppContent() {
  const { isSetup } = useTrip();

  // Debug: Check if deployment updated
  console.log("App Version: 1.1 (Deployed 2025-12-14)");

  if (!isSetup) {
    return <OnboardingPage />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scrap" element={<ScrapPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}

export default App;
