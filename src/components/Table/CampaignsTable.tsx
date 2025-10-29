import React, { useState } from 'react';
import styled from 'styled-components';
import { useCampaignsStore } from '../../store/campaignsStore';
import { useUIStore } from '../../store/uiStore';
import { Badge } from '../UI';
import { format } from 'date-fns';
import type { Campaign } from '../../types';

const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.base};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Th = styled.th<{ sortable?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  user-select: none;

  &:hover {
    ${({ sortable, theme }) => sortable && `
      color: ${theme.colors.neutral[900]};
    `}
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr<{ selected?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary[50] : 'transparent'};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const CampaignName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const ColorDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary[500]};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

interface CampaignsTableProps {
  campaigns: Campaign[];
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns }) => {
  const { selectCampaign } = useCampaignsStore();
  const { setCampaignDetailOpen } = useUIStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'startDate',
    direction: 'desc',
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(campaigns.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRowClick = (campaign: Campaign) => {
    selectCampaign(campaign.id);
    setCampaignDetailOpen(true);
  };

  const handleSort = (field: string) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aValue = a[sortBy.field as keyof Campaign];
    const bValue = b[sortBy.field as keyof Campaign];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusVariant = (status: Campaign['status']) => {
    switch (status) {
      case 'running':
        return 'running';
      case 'in-progress':
        return 'in-progress';
      case 'waiting':
        return 'waiting';
      case 'draft':
        return 'draft';
      case 'no-action':
        return 'no-action';
      default:
        return 'draft';
    }
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (campaigns.length === 0) {
    return (
      <TableContainer>
        <EmptyState>
          <p>No campaigns found</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Create your first campaign to get started</p>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th style={{ width: '40px' }}>
              <Checkbox
                checked={selectedIds.length === campaigns.length}
                onChange={handleSelectAll}
              />
            </Th>
            <Th sortable onClick={() => handleSort('name')}>
              Name {sortBy.field === 'name' && (sortBy.direction === 'asc' ? '↑' : '↓')}
            </Th>
            <Th sortable onClick={() => handleSort('startDate')}>
              Start Date {sortBy.field === 'startDate' && (sortBy.direction === 'asc' ? '↑' : '↓')}
            </Th>
            <Th>Duration</Th>
            <Th sortable onClick={() => handleSort('status')}>
              Status {sortBy.field === 'status' && (sortBy.direction === 'asc' ? '↑' : '↓')}
            </Th>
            <Th>Type</Th>
            <Th>Unique ID</Th>
            <Th>Visibility</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedCampaigns.map((campaign) => (
            <Tr key={campaign.id} selected={selectedIds.includes(campaign.id)}>
              <Td>
                <Checkbox
                  checked={selectedIds.includes(campaign.id)}
                  onChange={() => handleSelectRow(campaign.id)}
                />
              </Td>
              <Td>
                <CampaignName onClick={() => handleRowClick(campaign)}>
                  <ColorDot color={campaign.color} />
                  {campaign.name}
                </CampaignName>
              </Td>
              <Td>{format(new Date(campaign.startDate), 'MMM d, yyyy')}</Td>
              <Td>{getDuration(campaign.startDate, campaign.endDate)}</Td>
              <Td>
                <Badge variant={getStatusVariant(campaign.status)} size="sm">
                  {campaign.status.replace('-', ' ')}
                </Badge>
              </Td>
              <Td>{campaign.type}</Td>
              <Td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6B7280' }}>
                {campaign.uniqueId || '—'}
              </Td>
              <Td style={{ textTransform: 'capitalize' }}>{campaign.visibility}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

