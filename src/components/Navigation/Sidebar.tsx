import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { CreateNoteModal } from '../Notes/CreateNoteModal';
import { useNotesStore } from '../../store/notesStore';
import { Badge } from '../UI';

const SidebarContainer = styled.aside<{ open: boolean }>`
  width: ${({ open }) => open ? '280px' : '72px'};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.neutral.white};
  display: flex;
  flex-direction: column;
  transition: width ${({ theme }) => theme.transitions.base};
  position: fixed;
  left: 0;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  overflow: hidden;
`;

const LogoSection = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[800]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  min-height: 72px;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4361EE 0%, #3730A3 100%);
  border-radius: ${({ theme }) => theme.borderRadius.base};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  white-space: nowrap;
`;

const CreateButton = styled.button`
  margin: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: background-color ${({ theme }) => theme.transitions.base};
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavSection = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  overflow-y: auto;
`;

const SectionTitle = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[400]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  color: ${({ theme, active }) => 
    active ? theme.colors.neutral.white : theme.colors.neutral[400]};
  background-color: ${({ theme, active }) => 
    active ? theme.colors.neutral[800] : 'transparent'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[800]};
    color: ${({ theme }) => theme.colors.neutral.white};
  }

  ${({ active, theme }) => active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: ${theme.colors.primary[500]};
    }
  `}

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const NavItemText = styled.span`
  flex: 1;
`;

const Dropdown = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: absolute;
  top: 100%;
  left: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  min-width: 200px;
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const DropdownItem = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  color: ${({ theme }) => theme.colors.neutral[700]};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setQuickCreateCampaignOpen } = useUIStore();
  const { addNote } = useNotesStore();
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);

  const navItems = [
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/campaigns', label: 'Campaigns', icon: '🎯', badge: 'NEW' },
    { path: '/collections', label: 'Collections', icon: '📁' },
    { path: '/link-in-bio', label: 'Link in Bio', icon: '🔗' },
    { path: '/instagram-grid', label: 'Instagram grid', icon: '📸' },
  ];

  const handleCreateClick = () => {
    setCreateDropdownOpen(!createDropdownOpen);
  };

  const handleCreateCampaign = () => {
    setQuickCreateCampaignOpen(true);
    setCreateDropdownOpen(false);
  };

  const handleCreatePost = () => {
    navigate('/create-post');
    setCreateDropdownOpen(false);
  };

  const handleCreateNote = () => {
    setCreateNoteOpen(true);
    setCreateDropdownOpen(false);
  };

  const handleSaveNote = (note: { text: string; date: string; repeat: 'none' | 'daily' | 'weekly' | 'monthly'; shareability: 'private' | 'shared' }) => {
    addNote({
      content: note.text,
      date: note.date,
      repeat: note.repeat,
      visibility: note.shareability,
      color: '#9CA3AF',
    });
    setCreateNoteOpen(false);
  };

  return (
    <SidebarContainer open={sidebarOpen}>
      <LogoSection>
        <Logo>E</Logo>
        {sidebarOpen && <LogoText>PUBLISHER</LogoText>}
      </LogoSection>

      <div style={{ position: 'relative' }}>
        <CreateButton onClick={handleCreateClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {sidebarOpen && 'Create'}
        </CreateButton>
        
        {createDropdownOpen && (
          <Dropdown>
            <DropdownItem onClick={handleCreatePost}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Post
            </DropdownItem>
            <DropdownItem onClick={handleCreateCampaign}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Campaign
            </DropdownItem>
            <DropdownItem onClick={handleCreateNote}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Note
            </DropdownItem>
            <DropdownItem onClick={() => setCreateDropdownOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Collection
            </DropdownItem>
          </Dropdown>
        )}
      </div>

      <NavSection>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
            {sidebarOpen && (
              <>
                <NavItemText>{item.label}</NavItemText>
                {item.badge && <Badge variant="info" size="sm">{item.badge}</Badge>}
              </>
            )}
          </NavItem>
        ))}
        
        {sidebarOpen && <SectionTitle>Feeds</SectionTitle>}
      </NavSection>

      <CreateNoteModal
        isOpen={createNoteOpen}
        onClose={() => setCreateNoteOpen(false)}
        onSave={handleSaveNote}
      />
    </SidebarContainer>
  );
};
