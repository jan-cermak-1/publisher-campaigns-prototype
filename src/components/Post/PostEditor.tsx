import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, Badge } from '../UI';
import type { Campaign, Profile } from '../../types';

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${({ theme }) => theme.spacing[6]};
  height: 100%;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const MainEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const CampaignIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-left: 4px solid ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

const CampaignInfo = styled.div`
  flex: 1;
`;

const CampaignName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const CampaignMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const ChangeButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
`;

const SelectedProfiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProfileTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

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

const MediaUploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const UploadIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  color: ${({ theme }) => theme.colors.neutral[400]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0;
`;

const MediaActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ActionButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PreviewPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PreviewTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PreviewTab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary[500] : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary[50] : theme.colors.neutral.white};
  color: ${({ theme, active }) => 
    active ? theme.colors.primary[600] : theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const PreviewDevice = styled.div<{ deviceType: 'desktop' | 'mobile' }>`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme, deviceType }) => 
    deviceType === 'mobile' ? theme.spacing[4] : theme.spacing[6]};
  max-width: ${({ deviceType }) => deviceType === 'mobile' ? '375px' : '100%'};
  margin: 0 auto;
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const PreviewPost = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.neutral[800]};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const PreviewPlaceholder = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[400]};
  font-style: italic;
`;

const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  position: sticky;
  bottom: 0;
`;

const CharCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const FooterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

interface PostEditorProps {
  campaign?: Campaign | null;
  selectedProfiles: Profile[];
  onChangeCampaign: () => void;
  onChangeProfiles: () => void;
  onSaveDraft: (content: string) => void;
  onPublish: (content: string, publishDate: string) => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  campaign,
  selectedProfiles,
  onChangeCampaign,
  onChangeProfiles,
  onSaveDraft,
  onPublish,
}) => {
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  const handlePublish = () => {
    if (!publishDate) {
      alert('Please select a publish date');
      return;
    }
    onPublish(content, publishDate);
  };

  return (
    <>
      <EditorContainer>
        <MainEditor>
          {campaign && (
            <CampaignIndicator color={campaign.color}>
              <CampaignInfo>
                <CampaignName>{campaign.name}</CampaignName>
                <CampaignMeta>
                  <Badge variant={campaign.status as any}>{campaign.status}</Badge>
                </CampaignMeta>
              </CampaignInfo>
              <ChangeButton variant="outline" size="sm" onClick={onChangeCampaign}>
                Change
              </ChangeButton>
            </CampaignIndicator>
          )}

          <Section>
            <SectionTitle>Profiles</SectionTitle>
            <SelectedProfiles>
              {selectedProfiles.length === 0 ? (
                <Button variant="outline" onClick={onChangeProfiles}>
                  + Add profiles
                </Button>
              ) : (
                <>
                  {selectedProfiles.map((profile) => (
                    <ProfileTag key={profile.id}>
                      {profile.name}
                      <button onClick={onChangeProfiles}>×</button>
                    </ProfileTag>
                  ))}
                  <Button variant="outline" size="sm" onClick={onChangeProfiles}>
                    Change
                  </Button>
                </>
              )}
            </SelectedProfiles>
          </Section>

          <Section>
            <SectionTitle>Content</SectionTitle>
            <TextArea
              fullWidth
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </Section>

          <Section>
            <SectionTitle>Media</SectionTitle>
            <MediaUploadArea>
              <UploadIcon>📷</UploadIcon>
              <UploadText>Click or drag to upload media</UploadText>
            </MediaUploadArea>
            <MediaActions>
              <ActionButton variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Collections
              </ActionButton>
              <ActionButton variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Composer
              </ActionButton>
            </MediaActions>
          </Section>

          <Section>
            <SectionTitle>Schedule</SectionTitle>
            <Input
              type="datetime-local"
              fullWidth
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </Section>
        </MainEditor>

        <PreviewPanel>
          <PreviewTabs>
            <PreviewTab 
              active={previewMode === 'desktop'} 
              onClick={() => setPreviewMode('desktop')}
            >
              Desktop
            </PreviewTab>
            <PreviewTab 
              active={previewMode === 'mobile'} 
              onClick={() => setPreviewMode('mobile')}
            >
              Mobile
            </PreviewTab>
          </PreviewTabs>

          <PreviewDevice deviceType={previewMode}>
            {content ? (
              <PreviewPost>{content}</PreviewPost>
            ) : (
              <PreviewPlaceholder>
                Your post preview will appear here...
              </PreviewPlaceholder>
            )}
          </PreviewDevice>
        </PreviewPanel>
      </EditorContainer>

      <EditorFooter>
        <CharCount>
          {remainingChars >= 0 ? (
            <span>{remainingChars} characters remaining</span>
          ) : (
            <span style={{ color: '#EF4444' }}>
              {Math.abs(remainingChars)} characters over limit
            </span>
          )}
        </CharCount>
        <FooterActions>
          <Button variant="outline" onClick={() => onSaveDraft(content)}>
            Save as draft
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={!content || selectedProfiles.length === 0 || remainingChars < 0}
          >
            Publish
          </Button>
        </FooterActions>
      </EditorFooter>
    </>
  );
};

