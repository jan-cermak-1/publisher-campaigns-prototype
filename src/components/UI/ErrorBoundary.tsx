import React, { Component } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from './Button';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  max-width: 600px;
`;

const ErrorDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  max-width: 800px;
  width: 100%;

  summary {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.neutral[600]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing[2]};

    &:hover {
      color: ${({ theme }) => theme.colors.neutral[800]};
    }
  }

  pre {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    padding: ${({ theme }) => theme.spacing[4]};
    border-radius: ${({ theme }) => theme.borderRadius.base};
    overflow-x: auto;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  }
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
          </ErrorMessage>
          <Button onClick={this.handleReset}>
            Try again
          </Button>
          {this.state.error && (
            <ErrorDetails>
              <summary>Technical details</summary>
              <pre>{this.state.error.toString()}</pre>
              {this.state.errorInfo && (
                <pre>{this.state.errorInfo.componentStack}</pre>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

