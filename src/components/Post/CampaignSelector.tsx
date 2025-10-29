import React, { useState } from 'react';
import styled from 'styled-components';
import { useCampaignsStore } from '../../store/campaignsStore';
import { Badge } from '../UI';
import type { Campaign } from '../../types';

const SelectorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
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

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  max-height: 500px;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `0 ${theme.spacing[2]}`};
`;

const CampaignItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary[50] : 'transparent'};
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary[500] : 'transparent'};

  &:hover {
    background-color: ${({ selected, theme }) => 
      selected ? theme.colors.primary[50] : theme.colors.neutral[50]};
  }
`;

const ColorIndicator = styled.div<{ color: string }>`
  width: 4px;
  height: 40px;
  background-color: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const CampaignInfo = styled.div`
  flex: 1;
`;

const CampaignName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const CampaignMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const NoCampaignOption = styled(CampaignItem)`
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};

  &:hover {
    border-color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

interface CampaignSelectorProps {
  selectedCampaignId?: string;
  onSelect: (campaign: Campaign | null) => void;
}

export const CampaignSelector: React.FC<CampaignSelectorProps> = ({ 
  selectedCampaignId, 
  onSelect 
}) => {
  const { campaigns } = useCampaignsStore();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'profiles'>('campaigns');

  const now = new Date();
  
  const noCampaign = { 
    id: 'no-campaign', 
    name: 'No campaign',
    description: 'Create post without a campaign'
  };

  const recentCampaigns = campaigns
    .filter(c => {
      const endDate = new Date(c.endDate);
      return endDate >= now;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const inProgressCampaigns = campaigns.filter(c => 
    c.status === 'in-progress' || c.status === 'running'
  );

  const scheduledCampaigns = campaigns.filter(c => {
    const startDate = new Date(c.startDate);
    return startDate > now && (c.status === 'not-started' || c.status === 'waiting');
  });

  const handleCampaignClick = (campaign: Campaign | null) => {
    onSelect(campaign);
  };

  return (
    <SelectorContainer>
      <Header>
        <Title>Select campaign</Title>
        <Subtitle>Choose a campaign for your post or create without one</Subtitle>
      </Header>

      <Tabs>
        <Tab active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')}>
          Campaigns
        </Tab>
        <Tab active={activeTab === 'profiles'} onClick={() => setActiveTab('profiles')}>
          Profiles
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'campaigns' ? (
          <>
            <Section>
              <NoCampaignOption
                selected={selectedCampaignId === 'no-campaign'}
                onClick={() => handleCampaignClick(null)}
              >
                <CampaignInfo>
                  <CampaignName>{noCampaign.name}</CampaignName>
                  <CampaignMeta>{noCampaign.description}</CampaignMeta>
                </CampaignInfo>
              </NoCampaignOption>
            </Section>

            {recentCampaigns.length > 0 && (
              <Section>
                <SectionTitle>Recent</SectionTitle>
                {recentCampaigns.map((campaign) => (
                  <CampaignItem
                    key={campaign.id}
                    selected={selectedCampaignId === campaign.id}
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <ColorIndicator color={campaign.color} />
                    <CampaignInfo>
                      <CampaignName>{campaign.name}</CampaignName>
                      <CampaignMeta>
                        <Badge variant={campaign.status as any}>{campaign.status}</Badge>
                      </CampaignMeta>
                    </CampaignInfo>
                  </CampaignItem>
                ))}
              </Section>
            )}

            {inProgressCampaigns.length > 0 && (
              <Section>
                <SectionTitle>In Progress</SectionTitle>
                {inProgressCampaigns.map((campaign) => (
                  <CampaignItem
                    key={campaign.id}
                    selected={selectedCampaignId === campaign.id}
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <ColorIndicator color={campaign.color} />
                    <CampaignInfo>
                      <CampaignName>{campaign.name}</CampaignName>
                      <CampaignMeta>
                        <Badge variant={campaign.status as any}>{campaign.status}</Badge>
                      </CampaignMeta>
                    </CampaignInfo>
                  </CampaignItem>
                ))}
              </Section>
            )}

            {scheduledCampaigns.length > 0 && (
              <Section>
                <SectionTitle>Scheduled</SectionTitle>
                {scheduledCampaigns.map((campaign) => (
                  <CampaignItem
                    key={campaign.id}
                    selected={selectedCampaignId === campaign.id}
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <ColorIndicator color={campaign.color} />
                    <CampaignInfo>
                      <CampaignName>{campaign.name}</CampaignName>
                      <CampaignMeta>
                        <Badge variant={campaign.status as any}>{campaign.status}</Badge>
                        <span>•</span>
                        <span>Starts {new Date(campaign.startDate).toLocaleDateString()}</span>
                      </CampaignMeta>
                    </CampaignInfo>
                  </CampaignItem>
                ))}
              </Section>
            )}

            {campaigns.length === 0 && (
              <EmptyState>
                <p>No campaigns yet</p>
                <p>Create your first campaign to get started</p>
              </EmptyState>
            )}
          </>
        ) : (
          <EmptyState>
            <p>Profile-based campaign selection</p>
            <p>Coming soon...</p>
          </EmptyState>
        )}
      </Content>
    </SelectorContainer>
  );
};

