import React, { useState } from 'react';
import styled from 'styled-components';
import { CampaignSelector } from '../components/Post/CampaignSelector';
import { ProfileSelector } from '../components/Post/ProfileSelector';
import { PostEditor } from '../components/Post/PostEditor';
import { usePostsStore } from '../store/postsStore';
import type { Campaign, Profile } from '../types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
`;

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing[8]};
`;

// Mock profiles data
const mockProfiles: Profile[] = [
  {
    id: 'profile-1',
    name: 'Emplifi Facebook',
    username: '@emplifi',
    platform: 'facebook',
  },
  {
    id: 'profile-2',
    name: 'Emplifi Instagram',
    username: '@emplifi',
    platform: 'instagram',
  },
  {
    id: 'profile-3',
    name: 'Emplifi Twitter',
    username: '@emplifi',
    platform: 'twitter',
  },
  {
    id: 'profile-4',
    name: 'Emplifi LinkedIn',
    username: 'emplifi',
    platform: 'linkedin',
  },
  {
    id: 'profile-5',
    name: 'Emplifi TikTok',
    username: '@emplifi',
    platform: 'tiktok',
  },
];

export const CreatePostPage: React.FC = () => {
  const { addPost } = usePostsStore();
  const [step, setStep] = useState<'campaign' | 'profiles' | 'editor'>('campaign');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  const handleCampaignSelect = (campaign: Campaign | null) => {
    setSelectedCampaign(campaign);
    setStep('profiles');
  };

  const handleProfilesConfirm = () => {
    if (selectedProfileIds.length > 0) {
      setStep('editor');
    }
  };

  const handleProfilesCancel = () => {
    setStep('campaign');
  };

  const handleChangeCampaign = () => {
    setStep('campaign');
  };

  const handleChangeProfiles = () => {
    setStep('profiles');
  };

  const handleSaveDraft = (content: string) => {
    const newPost = {
      id: `post-${Date.now()}`,
      campaignId: selectedCampaign?.id,
      profiles: mockProfiles.filter(p => selectedProfileIds.includes(p.id)),
      content,
      media: [],
      publishDate: new Date().toISOString(),
      status: 'draft' as const,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addPost(newPost);
    alert('Draft saved!');
  };

  const handlePublish = (content: string, publishDate: string) => {
    const newPost = {
      id: `post-${Date.now()}`,
      campaignId: selectedCampaign?.id,
      profiles: mockProfiles.filter(p => selectedProfileIds.includes(p.id)),
      content,
      media: [],
      publishDate: new Date(publishDate).toISOString(),
      status: 'scheduled' as const,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addPost(newPost);
    alert('Post scheduled!');
    // Reset form
    setStep('campaign');
    setSelectedCampaign(null);
    setSelectedProfileIds([]);
  };

  return (
    <PageContainer>
      <TopBar>
        <Title>Create Post</Title>
      </TopBar>

      <Content>
        {step === 'campaign' && (
          <StepContainer>
            <CampaignSelector
              selectedCampaignId={selectedCampaign?.id || (selectedCampaign === null ? 'no-campaign' : undefined)}
              onSelect={handleCampaignSelect}
            />
          </StepContainer>
        )}

        {step === 'profiles' && (
          <StepContainer>
            <ProfileSelector
              profiles={mockProfiles}
              selectedProfileIds={selectedProfileIds}
              onSelect={setSelectedProfileIds}
              onConfirm={handleProfilesConfirm}
              onCancel={handleProfilesCancel}
            />
          </StepContainer>
        )}

        {step === 'editor' && (
          <PostEditor
            campaign={selectedCampaign}
            selectedProfiles={mockProfiles.filter(p => selectedProfileIds.includes(p.id))}
            onChangeCampaign={handleChangeCampaign}
            onChangeProfiles={handleChangeProfiles}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />
        )}
      </Content>
    </PageContainer>
  );
};
