import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.base};
  white-space: nowrap;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

  /* Sizes */
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
          height: 32px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.lg};
          height: 48px;
        `;
      default:
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
          height: 40px;
        `;
    }
  }}

  /* Variants */
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.neutral[200]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.neutral[300]};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary[500]};
          border: 1px solid ${theme.colors.primary[500]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[50]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary[100]};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.neutral[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.neutral[100]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.neutral[200]};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.status.error};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: #DC2626;
          }
          
          &:active:not(:disabled) {
            background-color: #B91C1C;
          }
        `;
      default: // primary
        return `
          background-color: ${theme.colors.primary[500]};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[600]};
          }
          
          &:active:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
          }
        `;
    }
  }}
`;

