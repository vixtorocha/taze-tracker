'use client';

import { useState } from 'react';
import HabitModal from './HabitModal';

type Props = {
  readonly sections: Section[];
  readonly onAdd: (name: string, color: string, sectionId?: string) => void;
};

export default function HabitInput({ sections, onAdd }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (name: string, color: string, sectionId?: string) => {
    onAdd(name, color, sectionId || undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          zIndex: 999,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        }}
        title='Add new habit'
      >
        +
      </button>
      <HabitModal
        isOpen={isModalOpen}
        mode='add'
        initialColor='#3B82F6'
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        sections={sections}
      />
    </>
  );
}
