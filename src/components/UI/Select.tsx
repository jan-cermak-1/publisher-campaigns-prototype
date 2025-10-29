import styled from 'styled-components';

interface SelectProps {
  error?: boolean;
  fullWidth?: boolean;
}

export const Select = styled.select<SelectProps>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  padding-right: ${({ theme }) => theme.spacing[8]};
  border: 1px solid ${({ theme, error }) => 
    error ? theme.colors.status.error : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing[2]} center;
  background-size: 20px;
  transition: all ${({ theme }) => theme.transitions.base};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  outline: none;
  appearance: none;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, error }) => 
      error ? theme.colors.status.error : theme.colors.neutral[400]};
  }

  &:focus {
    border-color: ${({ theme, error }) => 
      error ? theme.colors.status.error : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, error }) => 
      error ? `${theme.colors.status.error}20` : `${theme.colors.primary[500]}20`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

