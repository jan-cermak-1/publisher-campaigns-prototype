import React, { useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled.div<{ position: 'top' | 'bottom' | 'left' | 'right'; visible: boolean }>`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.neutral[900]};
  color: ${({ theme }) => theme.colors.neutral.white};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  pointer-events: none;
  opacity: ${({ visible }) => visible ? 1 : 0};
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  ${({ position }) => {
    switch (position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 8px;
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 8px;
        `;
    }
  }}

  &::after {
    content: '';
    position: absolute;
    border: 4px solid transparent;
    
    ${({ position, theme }) => {
      const color = theme.colors.neutral[900];
      switch (position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${color};
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${color};
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: ${color};
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: ${color};
          `;
      }
    }}
  }
`;

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  position = 'top', 
  children 
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <TooltipContent position={position} visible={visible}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

