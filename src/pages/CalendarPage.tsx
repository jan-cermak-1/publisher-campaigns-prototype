import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/Navigation/TopBar';
import { CalendarView } from '../components/Calendar/CalendarView';
import { FilterBar } from '../components/Calendar/FilterBar';
import { Button } from '../components/UI';
import { useCampaignsStore } from '../store/campaignsStore';
import { usePostsStore } from '../store/postsStore';

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const Content = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchCampaigns } = useCampaignsStore();
  const { fetchPosts } = usePostsStore();

  useEffect(() => {
    fetchCampaigns();
    fetchPosts();
  }, [fetchCampaigns, fetchPosts]);

  return (
    <PageContainer>
      <TopBar 
        title="Calendar" 
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/create-post')}>
              Create Post
            </Button>
          </>
        }
      />
      <Content>
        <FilterBar />
        <CalendarView />
      </Content>
    </PageContainer>
  );
};

