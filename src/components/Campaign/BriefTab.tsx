import React, { useState } from 'react';
import styled from 'styled-components';
import { useCampaignsStore } from '../../store/campaignsStore';
import type { Campaign } from '../../types';

const BriefContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-bottom: none;
  border-radius: ${({ theme }) => `${theme.borderRadius.base} ${theme.borderRadius.base} 0 0`};
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding-right: ${({ theme }) => theme.spacing[3]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[300]};

  &:last-child {
    border-right: none;
  }
`;

const ToolbarButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary[100] : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary[600] : theme.colors.neutral[600]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary[100] : theme.colors.neutral[100]};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const EditorContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => `0 0 ${theme.borderRadius.base} ${theme.borderRadius.base}`};
  min-height: 500px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
`;

const Editor = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.neutral[800]};
  outline: none;

  &:focus {
    outline: none;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin: ${({ theme }) => `${theme.spacing[4]} 0`};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: ${({ theme }) => `${theme.spacing[4]} 0`};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: ${({ theme }) => `${theme.spacing[3]} 0`};
  }

  p {
    margin: ${({ theme }) => `${theme.spacing[3]} 0`};
  }

  ul, ol {
    margin: ${({ theme }) => `${theme.spacing[3]} 0`};
    padding-left: ${({ theme }) => theme.spacing[8]};
  }

  li {
    margin: ${({ theme }) => `${theme.spacing[2]} 0`};
  }

  a {
    color: ${({ theme }) => theme.colors.primary[500]};
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.base};
    margin: ${({ theme }) => `${theme.spacing[4]} 0`};
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.neutral[300]};
    padding-left: ${({ theme }) => theme.spacing[4]};
    margin: ${({ theme }) => `${theme.spacing[4]} 0`};
    color: ${({ theme }) => theme.colors.neutral[600]};
    font-style: italic;
  }

  code {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: monospace;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }
`;

const Hint = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

interface BriefTabProps {
  campaign: Campaign;
  onUpdate: () => void;
}

export const BriefTab: React.FC<BriefTabProps> = ({ campaign, onUpdate }) => {
  const { saveCampaign } = useCampaignsStore();
  const [content, setContent] = useState(campaign.brief || '');

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    onUpdate();
  };

  const handleBlur = () => {
    saveCampaign(campaign.id, { brief: content });
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleImageUpload = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <BriefContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton onClick={() => execCommand('formatBlock', '<h1>')} title="Heading 1">
            <strong>H1</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('formatBlock', '<h2>')} title="Heading 2">
            <strong>H2</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('formatBlock', '<h3>')} title="Heading 3">
            <strong>H3</strong>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4M6 20h4m4-16l-4 16" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3v7a6 6 0 0012 0V3M4 21h16" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="9" y1="6" x2="20" y2="6" />
              <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="9" y1="12" x2="20" y2="12" />
              <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4" cy="6" r="1" fill="currentColor" />
              <circle cx="4" cy="12" r="1" fill="currentColor" />
              <circle cx="4" cy="18" r="1" fill="currentColor" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="9" y1="6" x2="20" y2="6" />
              <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="9" y1="12" x2="20" y2="12" />
              <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="9" y1="18" x2="20" y2="18" />
              <text x="3" y="8" fontSize="8" fill="currentColor">1</text>
              <text x="3" y="14" fontSize="8" fill="currentColor">2</text>
              <text x="3" y="20" fontSize="8" fill="currentColor">3</text>
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={handleLink} title="Insert Link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={handleImageUpload} title="Insert Image">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="8.5" cy="8.5" r="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-5-5L5 21" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={() => execCommand('formatBlock', '<blockquote>')} title="Quote">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>

      <EditorContainer>
        <Editor
          contentEditable
          onInput={handleInput}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: content || '<p>Start writing your campaign brief here...</p>' }}
        />
      </EditorContainer>

      <Hint>
        Use the toolbar above to format your text. Changes are saved automatically.
      </Hint>
    </BriefContainer>
  );
};

