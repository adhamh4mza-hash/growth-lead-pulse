import { useState } from 'react';
import { LeadEnrichmentForm } from '@/components/LeadEnrichmentForm';
import { Dashboard } from '@/components/Dashboard';

interface DashboardData {
  personalizedMessages: number;
  hoursSaved: number;
  moneySaved: number;
}

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const handleSubmissionComplete = (data: DashboardData) => {
    setDashboardData(data);
    setShowDashboard(true);
  };

  const handleStartNew = () => {
    setShowDashboard(false);
    setDashboardData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header with Logo */}
      <header className="p-6">
        <div className="container mx-auto">
          <div className="flex items-center">
            <h1 
              className="gradient-text font-bold text-3xl"
              style={{
                fontFamily: '"Clash Display", "Clash Display Placeholder", sans-serif',
                fontWeight: 700,
              }}
            >
              13 AI
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-12">
        {showDashboard && dashboardData ? (
          <Dashboard 
            data={dashboardData} 
            onStartNew={handleStartNew}
          />
        ) : (
          <LeadEnrichmentForm onSubmissionComplete={handleSubmissionComplete} />
        )}
      </main>
    </div>
  );
};

export default Index;
