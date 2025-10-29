import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Label, FormGroup, Select, Button } from '../UI';
import { useCampaignsStore } from '../../store/campaignsStore';
import type { Campaign } from '../../types';

const UTMContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const TemplateSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ParamRow = styled.div<{ enabled?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr 1fr auto;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme, enabled }) => 
    enabled ? theme.colors.neutral.white : theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  opacity: ${({ enabled }) => enabled ? 1 : 0.6};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const Toggle = styled.button<{ active?: boolean }>`
  width: 40px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary[500] : theme.colors.neutral[300]};
  cursor: pointer;
  position: relative;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ active }) => active ? '18px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.neutral.white};
    transition: left ${({ theme }) => theme.transitions.fast};
  }
`;

const ParamLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  min-width: 100px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  cursor: pointer;

  input[type="radio"] {
    cursor: pointer;
  }
`;

const PreviewContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

const PreviewLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PreviewURL = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: monospace;
  color: ${({ theme }) => theme.colors.primary[600]};
  word-break: break-all;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const VariableTag = styled.span`
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary[600]};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

interface UTMBuilderProps {
  campaign: Campaign;
  onUpdate: () => void;
}

interface UTMParam {
  key: string;
  label: string;
  enabled: boolean;
  mode: 'variable' | 'custom';
  value: string;
  variable: string;
}

export const UTMBuilder: React.FC<UTMBuilderProps> = ({ campaign, onUpdate }) => {
  const { saveCampaign } = useCampaignsStore();
  
  const [template, setTemplate] = useState(campaign.utmTemplateId || 'default');
  const [baseURL, setBaseURL] = useState('https://example.com');
  
  const [params, setParams] = useState<UTMParam[]>([
    {
      key: 'utm_source',
      label: 'Source',
      enabled: true,
      mode: 'variable',
      value: 'facebook',
      variable: '{PROFILE}',
    },
    {
      key: 'utm_medium',
      label: 'Medium',
      enabled: true,
      mode: 'variable',
      value: 'social',
      variable: '{POST_TYPE}',
    },
    {
      key: 'utm_campaign',
      label: 'Campaign',
      enabled: true,
      mode: 'variable',
      value: campaign.name.toLowerCase().replace(/\s+/g, '_'),
      variable: '{CAMPAIGN_NAME}',
    },
    {
      key: 'utm_content',
      label: 'Content',
      enabled: false,
      mode: 'variable',
      value: '',
      variable: '{POST_ID}',
    },
  ]);

  const handleToggle = (index: number) => {
    const newParams = [...params];
    newParams[index].enabled = !newParams[index].enabled;
    setParams(newParams);
    onUpdate();
  };

  const handleModeChange = (index: number, mode: 'variable' | 'custom') => {
    const newParams = [...params];
    newParams[index].mode = mode;
    setParams(newParams);
    onUpdate();
  };

  const handleValueChange = (index: number, value: string) => {
    const newParams = [...params];
    newParams[index].value = value;
    setParams(newParams);
    onUpdate();
  };

  const handleVariableChange = (index: number, variable: string) => {
    const newParams = [...params];
    newParams[index].variable = variable;
    setParams(newParams);
    onUpdate();
  };

  const generatePreviewURL = () => {
    const enabledParams = params.filter(p => p.enabled);
    const paramString = enabledParams
      .map(p => {
        const value = p.mode === 'variable' ? p.variable : p.value;
        return `${p.key}=${encodeURIComponent(value)}`;
      })
      .join('&');
    
    return paramString ? `${baseURL}?${paramString}` : baseURL;
  };

  const handleSave = () => {
    saveCampaign(campaign.id, {
      utmTemplateId: template,
      utmParams: params.reduce((acc, p) => {
        if (p.enabled) {
          acc[p.key] = p.mode === 'variable' ? p.variable : p.value;
        }
        return acc;
      }, {} as Record<string, string>),
    });
    onUpdate();
  };

  const handleReset = () => {
    setParams([
      {
        key: 'utm_source',
        label: 'Source',
        enabled: true,
        mode: 'variable',
        value: 'facebook',
        variable: '{PROFILE}',
      },
      {
        key: 'utm_medium',
        label: 'Medium',
        enabled: true,
        mode: 'variable',
        value: 'social',
        variable: '{POST_TYPE}',
      },
      {
        key: 'utm_campaign',
        label: 'Campaign',
        enabled: true,
        mode: 'variable',
        value: campaign.name.toLowerCase().replace(/\s+/g, '_'),
        variable: '{CAMPAIGN_NAME}',
      },
      {
        key: 'utm_content',
        label: 'Content',
        enabled: false,
        mode: 'variable',
        value: '',
        variable: '{POST_ID}',
      },
    ]);
    onUpdate();
  };

  return (
    <UTMContainer>
      <TemplateSelector>
        <Label>UTM Template</Label>
        <Select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="default">Default</option>
          <option value="social">Social Media</option>
          <option value="email">Email Campaign</option>
          <option value="paid">Paid Advertising</option>
        </Select>
      </TemplateSelector>

      <FormGroup>
        <Label>Base URL</Label>
        <Input
          fullWidth
          value={baseURL}
          onChange={(e) => setBaseURL(e.target.value)}
          placeholder="https://example.com"
        />
      </FormGroup>

      <div style={{ marginTop: '24px' }}>
        {params.map((param, index) => (
          <ParamRow key={param.key} enabled={param.enabled}>
            <Toggle
              active={param.enabled}
              onClick={() => handleToggle(index)}
              type="button"
            />
            
            <ParamLabel>{param.label}</ParamLabel>
            
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  checked={param.mode === 'variable'}
                  onChange={() => handleModeChange(index, 'variable')}
                  disabled={!param.enabled}
                />
                Variable
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  checked={param.mode === 'custom'}
                  onChange={() => handleModeChange(index, 'custom')}
                  disabled={!param.enabled}
                />
                Custom
              </RadioLabel>
            </RadioGroup>

            {param.mode === 'variable' ? (
              <Select
                value={param.variable}
                onChange={(e) => handleVariableChange(index, e.target.value)}
                disabled={!param.enabled}
              >
                <option value="{PROFILE}">Profile</option>
                <option value="{POST_TYPE}">Post Type</option>
                <option value="{CAMPAIGN_NAME}">Campaign Name</option>
                <option value="{POST_ID}">Post ID</option>
                <option value="{DATE}">Date</option>
              </Select>
            ) : (
              <Input
                value={param.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                disabled={!param.enabled}
                placeholder={`Enter ${param.label.toLowerCase()}`}
              />
            )}
          </ParamRow>
        ))}
      </div>

      <PreviewContainer>
        <PreviewLabel>
          Preview URL
          <VariableTag>Variables will be replaced at publish time</VariableTag>
        </PreviewLabel>
        <PreviewURL>{generatePreviewURL()}</PreviewURL>
      </PreviewContainer>

      <ActionButtons>
        <Button size="sm" onClick={handleSave}>
          Save changes
        </Button>
        <Button variant="outline" size="sm" onClick={handleSave}>
          Save as new template
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset to default
        </Button>
      </ActionButtons>
    </UTMContainer>
  );
};

