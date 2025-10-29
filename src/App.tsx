import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import { Sidebar } from './components/Navigation/Sidebar';
import { QuickCreateModal } from './components/Campaign/QuickCreateModal';
import { CampaignDetailModal } from './components/Campaign/CampaignDetailModal';
import { CalendarPage } from './pages/CalendarPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { useUIStore } from './store/uiStore';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ sidebarOpen }) => sidebarOpen ? '280px' : '72px'};
  transition: margin-left ${({ theme }) => theme.transitions.base};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <AppContainer>
          <Sidebar />
          <MainContent sidebarOpen={sidebarOpen}>
            <Routes>
              <Route path="/" element={<Navigate to="/calendar" replace />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/collections" element={<div>Collections (placeholder)</div>} />
              <Route path="/link-in-bio" element={<div>Link in Bio (placeholder)</div>} />
              <Route path="/instagram-grid" element={<div>Instagram Grid (placeholder)</div>} />
          </Routes>
        </MainContent>
        <QuickCreateModal />
        <CampaignDetailModal />
      </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
