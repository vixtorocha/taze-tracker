'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import HabitModal from './HabitModal';
import CustomCheckbox from './CustomCheckbox';

type Props = {
  id: string;
  name: string;
  color?: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (id: string, newName: string, color?: string) => void;
};

export default function HabitItem({ id, name, color = '#3B82F6', completed, onToggle, onDelete, onRename }: Props) {
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

  const handleEditSave = (newName: string, newColor: string) => {
    onRename(id, newName, newColor);
    setIsModalOpen(false);
  };

  return (
    <>
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
      <HabitModal
        isOpen={isModalOpen}
        mode='edit'
        initialName={name}
        initialColor={color}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEditSave}
        onDelete={onDelete}
      />
    </>
  );
}
