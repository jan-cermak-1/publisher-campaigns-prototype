import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  `}
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 4px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '24px';
      case 'lg': return '64px';
      default: return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '24px';
      case 'lg': return '64px';
      default: return '40px';
    }
  }};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ text = 'Loading...', size = 'md', fullScreen = false }) => {
  return (
    <LoadingContainer fullScreen={fullScreen}>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

