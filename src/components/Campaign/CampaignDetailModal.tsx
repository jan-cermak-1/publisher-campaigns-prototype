import React, { useState } from 'react';
import styled from 'styled-components';
import { useCampaignsStore } from '../../store/campaignsStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../UI';
import { SetupTab } from './SetupTab';
import { BriefTab } from './BriefTab';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: fadeIn ${({ theme }) => theme.transitions.base};

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  width: calc(100vw - ${({ theme }) => theme.spacing[8]});
  height: calc(100vh - ${({ theme }) => theme.spacing[8]});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp ${({ theme }) => theme.transitions.base};

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const CampaignName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const DateRange = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatusSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral[400]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.neutral[600]};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: 0 ${({ theme }) => theme.spacing[8]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, active }) => 
    active ? theme.colors.primary[500] : theme.colors.neutral[600]};
  cursor: pointer;
  position: relative;
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }

  ${({ active, theme }) => active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${theme.colors.primary[500]};
    }
  `}
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const PlaceholderTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-align: center;

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const SaveIndicator = styled.div<{ show: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  opacity: ${({ show }) => show ? 1 : 0};
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

export const CampaignDetailModal: React.FC = () => {
  const { campaignDetailOpen, setCampaignDetailOpen } = useUIStore();
  const { selectedCampaign, saveCampaign } = useCampaignsStore();
  const [activeTab, setActiveTab] = useState<'setup' | 'brief' | 'posts' | 'analytics' | 'activity'>('setup');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!selectedCampaign) return null;

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirm) return;
    }
    setCampaignDetailOpen(false);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveCampaign(selectedCampaign.id, {});
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await saveCampaign(selectedCampaign.id, { status: e.target.value as any });
  };

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'brief', label: 'Brief' },
    { id: 'posts', label: 'Posts' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'activity', label: 'Activity log' },
  ] as const;

  return (
    <ModalOverlay isOpen={campaignDetailOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <CampaignName>{selectedCampaign.name}</CampaignName>
            <DateRange>
              {new Date(selectedCampaign.startDate).toLocaleDateString()} - {new Date(selectedCampaign.endDate).toLocaleDateString()}
            </DateRange>
          </HeaderLeft>
          <HeaderRight>
            <StatusSelect value={selectedCampaign.status} onChange={handleStatusChange}>
              <option value="not-started">Not started</option>
              <option value="in-progress">In Progress</option>
              <option value="running">Running</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="no-action">No Action</option>
            </StatusSelect>
            <SaveIndicator show={isSaving}>Saving...</SaveIndicator>
            {hasUnsavedChanges && !isSaving && (
              <Button size="sm" onClick={handleSave}>Save changes</Button>
            )}
            <Button variant="outline" size="sm">Share</Button>
            <Button variant="outline" size="sm">Edit</Button>
            <CloseButton onClick={handleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          </HeaderRight>
        </Header>

        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabsContainer>

        <TabContent>
          {activeTab === 'setup' && (
            <SetupTab 
              campaign={selectedCampaign} 
              onUpdate={() => setHasUnsavedChanges(true)}
            />
          )}
          {activeTab === 'brief' && (
            <BriefTab 
              campaign={selectedCampaign} 
              onUpdate={() => setHasUnsavedChanges(true)}
            />
          )}
          {activeTab === 'posts' && (
            <PlaceholderTab>
              <h3>Posts</h3>
              <p>List of posts in this campaign will appear here</p>
            </PlaceholderTab>
          )}
          {activeTab === 'analytics' && (
            <PlaceholderTab>
              <h3>Analytics</h3>
              <p>Campaign analytics and metrics will appear here</p>
            </PlaceholderTab>
          )}
          {activeTab === 'activity' && (
            <PlaceholderTab>
              <h3>Activity Log</h3>
              <p>Campaign activity history will appear here</p>
            </PlaceholderTab>
          )}
        </TabContent>
      </ModalContent>
    </ModalOverlay>
  );
};

