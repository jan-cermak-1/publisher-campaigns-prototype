import styled from 'styled-components';

interface BadgeProps {
  variant?: 'running' | 'in-progress' | 'waiting' | 'draft' | 'no-action' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.xs};
        `;
      default:
        return `
          padding: ${theme.spacing[1]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        `;
    }
  }}

  ${({ variant = 'info', theme }) => {
    switch (variant) {
      case 'running':
        return `
          background-color: ${theme.colors.campaign.running}20;
          color: ${theme.colors.campaign.running};
        `;
      case 'in-progress':
        return `
          background-color: ${theme.colors.campaign.inProgress}20;
          color: ${theme.colors.campaign.inProgress};
        `;
      case 'waiting':
        return `
          background-color: ${theme.colors.campaign.waiting}20;
          color: #B45309;
        `;
      case 'draft':
        return `
          background-color: ${theme.colors.campaign.draft}20;
          color: ${theme.colors.campaign.draft};
        `;
      case 'no-action':
        return `
          background-color: ${theme.colors.campaign.noAction};
          color: ${theme.colors.neutral[600]};
        `;
      case 'success':
        return `
          background-color: ${theme.colors.status.successLight};
          color: ${theme.colors.status.success};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.status.errorLight};
          color: ${theme.colors.status.error};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.status.warningLight};
          color: ${theme.colors.status.warning};
        `;
      default: // info
        return `
          background-color: ${theme.colors.status.infoLight};
          color: ${theme.colors.status.info};
        `;
    }
  }}
`;

