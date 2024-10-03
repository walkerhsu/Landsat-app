import * as React from 'react';
import { LsText } from '../LsText';

type Props = {
  message: string;
};

export function NoContentSection({ message }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #c6c6c6',
        borderRadius: '4px',
        padding: '20px',
      }}
    >
      <LsText>{message}</LsText>
    </div>
  );
}
