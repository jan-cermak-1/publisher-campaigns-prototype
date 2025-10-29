import React from 'react';
import styled from 'styled-components';
import { useUIStore } from '../../store/uiStore';
import { useCampaignsStore } from '../../store/campaignsStore';
import { Button, Select } from '../UI';

const FilterBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ViewButtons = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => theme.spacing[1]};
`;

const ViewButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border: none;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.neutral.white : 'transparent'};
  color: ${({ theme, active }) => 
    active ? theme.colors.neutral[900] : theme.colors.neutral[600]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme, active }) => 
    active ? theme.shadows.sm : 'none'};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[900]};
  }
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const FilterBar: React.FC = () => {
  const { calendarView, setCalendarView } = useUIStore();
  const { filters, setFilters, campaigns } = useCampaignsStore();

  const views = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'day', label: 'Day' },
    { id: 'agenda', label: 'Agenda' },
  ] as const;

  return (
    <FilterBarContainer>
      <LeftSection>
        <FilterButton variant="outline" size="sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </FilterButton>

        <Select
          value={filters.campaignId || ''}
          onChange={(e) => setFilters({ campaignId: e.target.value || undefined })}
        >
          <option value="">All campaigns</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </Select>
      </LeftSection>

      <RightSection>
        <ViewButtons>
          {views.map((view) => (
            <ViewButton
              key={view.id}
              active={calendarView === view.id}
              onClick={() => setCalendarView(view.id)}
            >
              {view.label}
            </ViewButton>
          ))}
        </ViewButtons>
      </RightSection>
    </FilterBarContainer>
  );
};

