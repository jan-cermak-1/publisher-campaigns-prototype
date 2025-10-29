import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Input } from '../UI';
import type { Profile } from '../../types';

const SelectorContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
`;

const SearchRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PlatformFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PlatformButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
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
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  max-height: 400px;
  overflow-y: auto;
`;

const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ProfileItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primary[50] : 'transparent'};

  &:hover {
    background-color: ${({ selected, theme }) => 
      selected ? theme.colors.primary[50] : theme.colors.neutral[50]};
  }
`;

const ProfileAvatar = styled.div<{ platform: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ platform }) => {
    const colors: Record<string, string> = {
      facebook: 'linear-gradient(135deg, #3b5998, #8b9dc3)',
      instagram: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      twitter: 'linear-gradient(135deg, #1da1f2, #0d95e8)',
      linkedin: 'linear-gradient(135deg, #0077b5, #00a0dc)',
      youtube: 'linear-gradient(135deg, #ff0000, #cc0000)',
      tiktok: 'linear-gradient(135deg, #000000, #ee1d52, #69c9d0)',
    };
    return colors[platform] || 'linear-gradient(135deg, #9CA3AF, #6B7280)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ProfileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-transform: capitalize;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const SelectedCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};

  strong {
    color: ${({ theme }) => theme.colors.neutral[900]};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

interface ProfileSelectorProps {
  profiles: Profile[];
  selectedProfileIds: string[];
  onSelect: (profileIds: string[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  selectedProfileIds,
  onSelect,
  onConfirm,
  onCancel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);

  const platforms = Array.from(new Set(profiles.map(p => p.platform)));

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = !platformFilter || profile.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleToggle = (profileId: string) => {
    if (selectedProfileIds.includes(profileId)) {
      onSelect(selectedProfileIds.filter(id => id !== profileId));
    } else {
      onSelect([...selectedProfileIds, profileId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProfileIds.length === filteredProfiles.length) {
      onSelect([]);
    } else {
      onSelect(filteredProfiles.map(p => p.id));
    }
  };

  const handlePlatformFilter = (platform: string) => {
    if (platformFilter === platform) {
      setPlatformFilter(null);
    } else {
      setPlatformFilter(platform);
    }
  };

  return (
    <SelectorContainer>
      <Header>
        <Title>Select profiles</Title>
        <SearchRow>
          <Input
            fullWidth
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchRow>
        <PlatformFilters>
          <PlatformButton
            active={platformFilter === null}
            onClick={() => setPlatformFilter(null)}
          >
            All
          </PlatformButton>
          {platforms.map((platform) => (
            <PlatformButton
              key={platform}
              active={platformFilter === platform}
              onClick={() => handlePlatformFilter(platform)}
            >
              {platform}
            </PlatformButton>
          ))}
        </PlatformFilters>
      </Header>

      <Content>
        <SelectAllRow>
          <Checkbox
            checked={selectedProfileIds.length === filteredProfiles.length && filteredProfiles.length > 0}
            onChange={handleSelectAll}
          />
          <span>Select all ({filteredProfiles.length})</span>
        </SelectAllRow>

        {filteredProfiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            selected={selectedProfileIds.includes(profile.id)}
            onClick={() => handleToggle(profile.id)}
          >
            <Checkbox
              checked={selectedProfileIds.includes(profile.id)}
              onChange={() => handleToggle(profile.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <ProfileAvatar platform={profile.platform}>
              {profile.name.charAt(0).toUpperCase()}
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileName>{profile.name}</ProfileName>
              <ProfileMeta>
                <span>{profile.platform}</span>
              </ProfileMeta>
            </ProfileInfo>
          </ProfileItem>
        ))}
      </Content>

      <Footer>
        <SelectedCount>
          <strong>{selectedProfileIds.length}</strong> profile{selectedProfileIds.length !== 1 ? 's' : ''} selected
        </SelectedCount>
        <Actions>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={onConfirm}
            disabled={selectedProfileIds.length === 0}
          >
            Continue
          </Button>
        </Actions>
      </Footer>
    </SelectorContainer>
  );
};

