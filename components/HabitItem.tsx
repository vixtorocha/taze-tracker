'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import HabitModal from './HabitModal';
import DragPlaceholder from './DragPlaceholder';
import CustomCheckbox from './CustomCheckbox';

type Props = {
  readonly id: string;
  readonly name: string;
  readonly color?: string;
  readonly completed: boolean;
  readonly sectionId?: string;
  readonly sections?: Section[];
  readonly onToggle: () => void;
  readonly onDelete: () => void;
  readonly onRename: (id: string, newName: string, color?: string, sectionId?: string) => void;
  readonly isDropHover?: boolean;
  readonly isDragging?: boolean;
};

export default function HabitItem({
  id,
  name,
  color = '#3B82F6',
  completed,
  sectionId,
  sections = [],
  onToggle,
  onDelete,
  onRename,
  isDragging = false,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '6px',
    touchAction: 'none',
  };

  const handleEditSave = (newName: string, newColor: string, newSectionId?: string) => {
    onRename(id, newName, newColor, newSectionId);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Render placeholder when dragging inside sections */}
      {isDragging ? (
        <DragPlaceholder
          name={name}
          color={color}
          completed={completed}
          style={style}
          onToggle={onToggle}
          type='dragging'
        />
      ) : (
        <li ref={setNodeRef} style={style}>
          <CustomCheckbox checked={completed} onChange={onToggle} color={color} />
          <span
            onClick={() => setIsModalOpen(true)}
            className={`cursor-pointer transition-all flex-1 ${completed ? 'line-through text-gray-400' : ''}`}
          >
            {name}
          </span>
          <span {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
            ::
          </span>
        </li>
      )}
      <HabitModal
        isOpen={isModalOpen}
        mode='edit'
        initialName={name}
        initialColor={color}
        initialSectionId={sectionId}
        sections={sections}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEditSave}
        onDelete={onDelete}
      />
    </>
  );
}
