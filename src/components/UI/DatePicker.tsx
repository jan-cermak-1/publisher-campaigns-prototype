import styled from 'styled-components';
import { Input } from './Input';

export const DatePicker = styled(Input).attrs({ type: 'date' })`
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: opacity(0.5);
    
    &:hover {
      filter: opacity(1);
    }
  }
`;

export const DateTimePicker = styled(Input).attrs({ type: 'datetime-local' })`
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: opacity(0.5);
    
    &:hover {
      filter: opacity(1);
    }
  }
`;

