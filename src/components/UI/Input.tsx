import styled from 'styled-components';

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme, error }) => 
    error ? theme.colors.status.error : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  transition: all ${({ theme }) => theme.transitions.base};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  outline: none;

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

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TextArea = styled.textarea<InputProps>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme, error }) => 
    error ? theme.colors.status.error : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.neutral[900]};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  transition: all ${({ theme }) => theme.transitions.base};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

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

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

