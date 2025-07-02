import React from 'react';

interface TransactionTutorialBoxProps {
  instruction: string;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const TransactionTutorialBox: React.FC<TransactionTutorialBoxProps> = ({
  instruction,
  onNext,
  onPrev,
  onExit,
  isFirstStep,
  isLastStep,
}) => (
  <div
    style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: 24,
      minWidth: 320,
      maxWidth: 480,
      zIndex: 1200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <div style={{ marginBottom: 16, color: '#374151', textAlign: 'center' }}>
      {instruction}
    </div>
    <div style={{ display: 'flex', gap: 16 }}>
      <button
        onClick={onPrev}
        disabled={isFirstStep}
        style={{
          padding: '8px 20px',
          borderRadius: 6,
          background: isFirstStep ? '#e5e7eb' : '#7c3aed',
          color: isFirstStep ? '#9ca3af' : 'white',
          border: 'none',
          cursor: isFirstStep ? 'not-allowed' : 'pointer',
        }}
      >
        Prev
      </button>
      <button
        onClick={isLastStep ? onExit : onNext}
        style={{
          padding: '8px 20px',
          borderRadius: 6,
          background: '#7c3aed',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isLastStep ? 'Finish' : 'Next'}
      </button>
    </div>
    <button
      onClick={onExit}
      style={{
        marginTop: 12,
        background: 'none',
        border: 'none',
        color: '#7c3aed',
        cursor: 'pointer',
        fontSize: 14,
        textDecoration: 'underline',
      }}
    >
      Exit Tutorial
    </button>
  </div>
);

export default TransactionTutorialBox;