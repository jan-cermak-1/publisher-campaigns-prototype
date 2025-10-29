import React from 'react';
import styled from 'styled-components';

interface TopBarProps {
  title: string;
  actions?: React.ReactNode;
}

const TopBarContainer = styled.div`
  height: 72px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[6]};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const TopBar: React.FC<TopBarProps> = ({ title, actions }) => {
  return (
    <TopBarContainer>
      <Title>{title}</Title>
      {actions && <ActionsContainer>{actions}</ActionsContainer>}
    </TopBarContainer>
  );
};

