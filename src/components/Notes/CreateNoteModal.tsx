import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Label, FormGroup, Select, TextArea } from '../UI';

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
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: {
    text: string;
    date: string;
    repeat: 'none' | 'daily' | 'weekly' | 'monthly';
    shareability: 'private' | 'shared';
  }) => void;
  initialDate?: string;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
}) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [shareability, setShareability] = useState<'private' | 'shared'>('private');

  const handleSave = () => {
    if (!text.trim()) {
      alert('Please enter note text');
      return;
    }

    onSave({ text, date, repeat, shareability });
    
    // Reset form
    setText('');
    setDate(new Date().toISOString().split('T')[0]);
    setRepeat('none');
    setShareability('private');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Create Note</Title>
        </Header>

        <Body>
          <FormGroup>
            <Label>Note</Label>
            <TextArea
              fullWidth
              placeholder="Enter your note..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ minHeight: '100px' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Date</Label>
            <Input
              fullWidth
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Repeat</Label>
            <Select
              fullWidth
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as any)}
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Shareability</Label>
            <Select
              fullWidth
              value={shareability}
              onChange={(e) => setShareability(e.target.value as any)}
            >
              <option value="private">Private</option>
              <option value="shared">Shared with team</option>
            </Select>
          </FormGroup>
        </Body>

        <Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save note
          </Button>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

