import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Label, FormGroup, Select, DatePicker } from '../UI';
import { useCampaignsStore } from '../../store/campaignsStore';
import { colors } from '../../styles/soulTokens';
import type { Campaign } from '../../types';
import { UTMBuilder } from './UTMBuilder';

const SetupContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ColorPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ColorOption = styled.button<{ color: string; selected?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background-color: ${({ color }) => color};
  border: 3px solid ${({ selected, theme }) => 
    selected ? theme.colors.neutral[900] : theme.colors.neutral[200]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const LabelTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.neutral[500]};
    
    &:hover {
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
  }
`;

const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AddButton = styled.button`
  background: none;
  border: 1px dashed ${({ theme }) => theme.colors.neutral[300]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[500]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

interface SetupTabProps {
  campaign: Campaign;
  onUpdate: () => void;
}

export const SetupTab: React.FC<SetupTabProps> = ({ campaign, onUpdate }) => {
  const { saveCampaign } = useCampaignsStore();
  const [localCampaign, setLocalCampaign] = useState(campaign);

  const handleChange = (field: keyof Campaign, value: any) => {
    setLocalCampaign({ ...localCampaign, [field]: value });
    onUpdate();
  };

  const handleBlur = () => {
    saveCampaign(campaign.id, localCampaign);
  };

  const handleAddLabel = () => {
    const label = prompt('Enter label name:');
    if (label) {
      const newLabels = [...localCampaign.contentLabels, label];
      handleChange('contentLabels', newLabels);
      saveCampaign(campaign.id, { contentLabels: newLabels });
    }
  };

  const handleRemoveLabel = (index: number) => {
    const newLabels = localCampaign.contentLabels.filter((_, i) => i !== index);
    handleChange('contentLabels', newLabels);
    saveCampaign(campaign.id, { contentLabels: newLabels });
  };

  return (
    <SetupContainer>
      <Section>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Campaign
        </SectionTitle>

        <FormGroup>
          <Label>Name</Label>
          <Input
            fullWidth
            value={localCampaign.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={handleBlur}
          />
        </FormGroup>

        <Grid>
          <FormGroup>
            <Label>Color</Label>
            <ColorPicker>
              {colors.palette.map((color) => (
                <ColorOption
                  key={color}
                  color={color}
                  selected={localCampaign.color === color}
                  onClick={() => {
                    handleChange('color', color);
                    saveCampaign(campaign.id, { color });
                  }}
                  type="button"
                />
              ))}
            </ColorPicker>
          </FormGroup>

          <FormGroup>
            <Label>Type</Label>
            <Select
              fullWidth
              value={localCampaign.type}
              onChange={(e) => {
                handleChange('type', e.target.value);
                handleBlur();
              }}
            >
              <option value="">Select...</option>
              <option value="Brand">Brand</option>
              <option value="New product">New product</option>
              <option value="New product releas">New product release</option>
              <option value="Service">Service</option>
              <option value="App">App</option>
              <option value="Analytics">Analytics</option>
              <option value="Network">Network</option>
              <option value="Training">Training</option>
              <option value="Product">Product</option>
              <option value="Research">Research</option>
            </Select>
          </FormGroup>
        </Grid>

        <FormGroup>
          <Label>
            Unique ID
            <svg style={{ width: '14px', height: '14px', marginLeft: '4px', display: 'inline' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Label>
          <Input
            fullWidth
            value={localCampaign.uniqueId || ''}
            onChange={(e) => handleChange('uniqueId', e.target.value)}
            onBlur={handleBlur}
            placeholder="Optional unique identifier for this campaign"
          />
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Date Range
        </SectionTitle>

        <Grid>
          <FormGroup>
            <Label>Start Date</Label>
            <DatePicker
              fullWidth
              value={localCampaign.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              onBlur={handleBlur}
            />
          </FormGroup>

          <FormGroup>
            <Label>End Date</Label>
            <DatePicker
              fullWidth
              value={localCampaign.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              onBlur={handleBlur}
            />
          </FormGroup>
        </Grid>

        <FormGroup>
          <Label>Repeat</Label>
          <Select
            fullWidth
            value={localCampaign.repeat || 'none'}
            onChange={(e) => {
              handleChange('repeat', e.target.value);
              handleBlur();
            }}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Content Labels
        </SectionTitle>

        <LabelsContainer>
          {localCampaign.contentLabels.map((label, index) => (
            <LabelTag key={index}>
              {label}
              <button onClick={() => handleRemoveLabel(index)}>×</button>
            </LabelTag>
          ))}
        </LabelsContainer>
        <AddButton onClick={handleAddLabel} type="button">
          + Add label
        </AddButton>
      </Section>

      <Section>
        <SectionTitle>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Link URL Preset (UTM)
        </SectionTitle>

        <UTMBuilder campaign={localCampaign} onUpdate={onUpdate} />
      </Section>
    </SetupContainer>
  );
};

