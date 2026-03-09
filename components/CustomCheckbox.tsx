'use client';

type Props = {
  checked: boolean;
  onChange: () => void;
  color: string;
};

export default function CustomCheckbox({ checked, onChange, color }: Props) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        border: `2px solid ${color}`,
        backgroundColor: checked ? color : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'all 0.2s ease',
        boxShadow: checked ? `0 0 0 3px ${color}30` : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 3px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = checked ? `0 0 0 3px ${color}30` : 'none';
      }}
      aria-label='Toggle habit completion'
    >
      {checked && (
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          stroke='white'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='2 8 6 12 14 4' />
        </svg>
      )}
    </button>
  );
}
