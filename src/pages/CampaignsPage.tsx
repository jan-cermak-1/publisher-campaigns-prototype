import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TopBar } from '../components/Navigation/TopBar';
import { CampaignsTable } from '../components/Table/CampaignsTable';
import { Button, Select } from '../components/UI';
import { useCampaignsStore } from '../store/campaignsStore';
import { useUIStore } from '../store/uiStore';
import type { Campaign } from '../types';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const Content = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 400px;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const CampaignsPage: React.FC = () => {
  const { campaigns, fetchCampaigns } = useCampaignsStore();
  const { setQuickCreateCampaignOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('active');

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    // Search filter
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = campaign.status === 'running' || campaign.status === 'in-progress';
    } else if (statusFilter === 'draft') {
      matchesStatus = campaign.status === 'draft';
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      <TopBar 
        title="Campaigns" 
        actions={
          <>
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm" onClick={() => setQuickCreateCampaignOpen(true)}>
              Create Campaign
            </Button>
          </>
        }
      />
      <Content>
        <FilterBar>
          <SearchInput 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="active">Show: Active campaigns</option>
            <option value="all">Show: All campaigns</option>
            <option value="draft">Show: Draft campaigns</option>
          </Select>
        </FilterBar>
        
        <CampaignsTable campaigns={filteredCampaigns} />
      </Content>
    </PageContainer>
  );
};

