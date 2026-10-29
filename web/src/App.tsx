import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { IncidentProvider, useIncidents } from './context/IncidentContext';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LiveIncidentFeedToast } from './components/LiveIncidentFeedToast';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { IncidentListPage } from './pages/incidents/IncidentListPage';
import { IncidentDetailsPage } from './pages/incidents/IncidentDetailsPage';
import { ClassroomListPage } from './pages/classrooms/ClassroomListPage';
import { DeviceListPage } from './pages/devices/DeviceListPage';
import { QRManagementPage } from './pages/qr-management/QRManagementPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { UserManagementPage } from './pages/users/UserManagementPage';
import { ProfilePage } from './pages/profile/ProfilePage';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // QR Hub target state
  const [qrHubTarget, setQrHubTarget] = useState<{
    type: 'classroom' | 'device';
    id: string;
  } | null>(null);

  // Room filter state for devices page
  const [devicesRoomFilter, setDevicesRoomFilter] = useState<string>('all');

  const { activeIncidentId, setActiveIncidentId } = useIncidents();

  // Sync active incident
  useEffect(() => {
    if (activeIncidentId) {
      setSelectedIncidentId(activeIncidentId);
    }
  }, [activeIncidentId]);

  const handleOpenIncident = (id: string) => {
    setSelectedIncidentId(id);
    setActiveIncidentId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToIncidents = () => {
    setSelectedIncidentId(null);
    setActiveIncidentId(null);
    if (currentPage !== 'dashboard') {
      setCurrentPage('incidents');
    }
  };

  const handleOpenQr = (type: 'classroom' | 'device', id: string) => {
    setQrHubTarget({ type, id });
    setCurrentPage('qr-management');
    setSelectedIncidentId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRoom = (roomId: string) => {
    setDevicesRoomFilter(roomId);
    setCurrentPage('devices');
    setSelectedIncidentId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 antialiased selection:bg-zinc-200 selection:text-zinc-900">
      {/* Role-Adaptive Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setSelectedIncidentId(null);
          setIsMobileSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Topbar */}
        <Topbar
          currentPage={currentPage}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 pb-16">
          {selectedIncidentId ? (
            <IncidentDetailsPage
              incidentId={selectedIncidentId}
              onBack={handleBackToIncidents}
              onNavigate={(page) => {
                setCurrentPage(page);
                setSelectedIncidentId(null);
              }}
              onViewQr={handleOpenQr}
            />
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <DashboardPage
                  onNavigate={setCurrentPage}
                  onSelectIncident={handleOpenIncident}
                />
              )}

              {currentPage === 'incidents' && (
                <IncidentListPage onSelectIncident={handleOpenIncident} />
              )}


              {currentPage === 'classrooms' && (
                <ClassroomListPage
                  onSelectRoom={handleSelectRoom}
                  onOpenQr={handleOpenQr}
                />
              )}

              {currentPage === 'devices' && (
                <DeviceListPage
                  onOpenQr={handleOpenQr}
                  selectedRoomFilter={devicesRoomFilter}
                />
              )}

              {currentPage === 'reports' && <AnalyticsPage />}

              {currentPage === 'qr-management' && (
                <QRManagementPage
                  initialType={qrHubTarget?.type || 'classroom'}
                  initialId={qrHubTarget?.id}
                />
              )}

              {currentPage === 'users' && <UserManagementPage />}

              {currentPage === 'profile' && <ProfilePage />}
            </>
          )}
        </main>
      </div>

      {/* Realtime Live Incoming Incident Toast Alert */}
      <LiveIncidentFeedToast onOpenIncident={handleOpenIncident} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <IncidentProvider>
        <MainApp />
      </IncidentProvider>
    </AuthProvider>
  );
}
