import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../UI/Modal';
import { Button, Input, TextArea, Select, Label, FormGroup, DatePicker } from '../UI';
import { useUIStore } from '../../store/uiStore';
import { useCampaignsStore } from '../../store/campaignsStore';
import { colors } from '../../styles/soulTokens';
import { v4 as uuidv4 } from 'uuid';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ColorPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ColorOption = styled.button<{ color: string; selected?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background-color: ${({ color }) => color};
  border: 3px solid ${({ selected, theme }) => 
    selected ? theme.colors.neutral[900] : 'transparent'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const DateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const MoreOptionsLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const QuickCreateModal: React.FC = () => {
  const { quickCreateCampaignOpen, setQuickCreateCampaignOpen, setCampaignDetailOpen } = useUIStore();
  const { createCampaign, selectCampaign } = useCampaignsStore();

  const [formData, setFormData] = useState({
    name: '',
    color: colors.palette[0],
    brief: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    utmTemplateId: 'utm1',
  });

  const handleClose = () => {
    setQuickCreateCampaignOpen(false);
    setFormData({
      name: '',
      color: colors.palette[0],
      brief: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      utmTemplateId: 'utm1',
    });
  };

  const handleCreate = async () => {
    const newCampaign = {
      name: formData.name,
      color: formData.color,
      type: 'General',
      startDate: formData.startDate,
      endDate: formData.endDate,
      repeat: 'none' as const,
      brief: formData.brief,
      utmTemplateId: formData.utmTemplateId,
      utmParams: {
        source: 'social',
        medium: 'post',
        campaign: formData.name.toLowerCase().replace(/\s+/g, '_'),
      },
      contentLabels: [formData.name],
      status: 'draft' as const,
      visibility: 'global' as const,
      createdBy: 'user1',
    };

    await createCampaign(newCampaign);
    handleClose();
  };

  const handleMoreOptions = () => {
    // Create draft campaign and open detail modal
    const tempId = uuidv4();
    selectCampaign(tempId);
    setQuickCreateCampaignOpen(false);
    setCampaignDetailOpen(true);
  };

  return (
    <Modal
      isOpen={quickCreateCampaignOpen}
      onClose={handleClose}
      size="md"
      title="Create Campaign"
    >
      <ModalContent>
        <FormGroup>
          <Label>Campaign Name</Label>
          <Input
            fullWidth
            placeholder="Enter campaign name..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </FormGroup>

        <FormGroup>
          <Label>Color</Label>
          <ColorPicker>
            {colors.palette.map((color) => (
              <ColorOption
                key={color}
                color={color}
                selected={formData.color === color}
                onClick={() => setFormData({ ...formData, color })}
                type="button"
              />
            ))}
          </ColorPicker>
        </FormGroup>

        <DateRow>
          <FormGroup>
            <Label>Start Date</Label>
            <DatePicker
              fullWidth
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>End Date</Label>
            <DatePicker
              fullWidth
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </FormGroup>
        </DateRow>

        <FormGroup>
          <Label>Brief (optional)</Label>
          <TextArea
            fullWidth
            placeholder="Add a short brief for this campaign..."
            value={formData.brief}
            onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
          />
        </FormGroup>

        <FormGroup>
          <Label>UTM Template</Label>
          <Select
            fullWidth
            value={formData.utmTemplateId}
            onChange={(e) => setFormData({ ...formData, utmTemplateId: e.target.value })}
          >
            <option value="utm1">New product</option>
            <option value="utm2">Default template</option>
          </Select>
        </FormGroup>

        <Actions>
          <MoreOptionsLink onClick={handleMoreOptions} type="button">
            More options
          </MoreOptionsLink>
          <ButtonGroup>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name}>
              Create Campaign
            </Button>
          </ButtonGroup>
        </Actions>
      </ModalContent>
    </Modal>
  );
};

