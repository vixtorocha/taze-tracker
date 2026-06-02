import CustomCheckbox from './CustomCheckbox';

type Props = {
  readonly name?: string;
  readonly color?: string;
  readonly completed?: boolean;
  readonly type?: 'dragging' | 'insertion';
  readonly onToggle?: () => void;
  readonly style?: React.CSSProperties;
};

export default function DragPlaceholder({
  name = '',
  color = '#3B82F6',
  completed = false,
  type = 'insertion',
  style = {},
}: Props) {
  // Insertion point placeholder (used when dragging between sections)
  if (type === 'insertion') {
    return (
      <div
        style={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--button-secondary)',
          borderRadius: '6px',
          margin: '8px 0',
          border: '2px dashed var(--border)',
          gap: '12px',
          padding: '8px',
        }}
      >
        <CustomCheckbox checked={completed} color={color} />
        <span className={`flex-1 ${completed ? 'line-through text-gray-400' : ''}`}>{name}</span>
        <span style={{ cursor: 'grab', padding: '4px' }}>::</span>
      </div>
    );
  }

  // Dragging placeholder (used when dragging within sections)
  return (
    <li style={{ ...style, opacity: 0.5, backgroundColor: 'var(--button-secondary)', cursor: 'grabbing' }}>
      <CustomCheckbox checked={completed} color={color} />
      <span className={`flex-1 ${completed ? 'line-through text-gray-400' : ''}`}>{name}</span>
      <span style={{ cursor: 'grab', padding: '4px' }}>::</span>
    </li>
  );
}
