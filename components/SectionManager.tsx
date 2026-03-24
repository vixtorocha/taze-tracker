'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';

type Props = {
  isOpen: boolean;
  sections: Section[];
  onClose: () => void;
  onSave: (sections: Section[]) => void;
  onAddSection: (name: string) => void;
};

function SectionItem({ id, name, onDelete }: { id: string; name: string; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: 'var(--input-bg)',
    border: '1px solid var(--border)',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <span className='flex-1'>{name}</span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px' }}>
          ⋮⋮
        </span>
        {name !== 'No Section' && (
          <button
            onClick={onDelete}
            style={{
              padding: '4px 8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function SectionManager({ isOpen, sections, onClose, onSave, onAddSection }: Props) {
  const [newSectionName, setNewSectionName] = useState('');
  const [localSections, setLocalSections] = useState(sections);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      onAddSection(newSectionName);

      // Optimistically add to local state
      const newSection: Section = {
        id: crypto.randomUUID(),
        name: newSectionName.trim(),
        order: localSections.length,
        user_id: 'user-1',
      };
      setLocalSections([...localSections, newSection]);
      setNewSectionName('');
    }
  };

  const handleDeleteSection = (id: string) => {
    setLocalSections(localSections.filter((section) => section.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localSections.findIndex((section) => section.id === active.id);
    const newIndex = localSections.findIndex((section) => section.id === over.id);

    const newOrder = arrayMove(localSections, oldIndex, newIndex).map((section, index) => ({
      ...section,
      order: index,
    }));
    setLocalSections(newOrder);
  };

  const handleSave = () => {
    onSave(localSections);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--background)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          color: 'var(--foreground)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Manage Sections</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.7 }}>
            Add New Section
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type='text'
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
              placeholder='Section name'
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--foreground)',
              }}
            />
            <button
              onClick={handleAddSection}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>
        </div>

        <h3 style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.7 }}>
          Reorder & Delete Sections
        </h3>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={localSections} strategy={verticalListSortingStrategy}>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
              {localSections.map((section) => (
                <li key={section.id} style={{ marginBottom: '8px' }}>
                  <SectionItem id={section.id} name={section.name} onDelete={() => handleDeleteSection(section.id)} />
                </li>
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--button-secondary)',
              color: 'var(--button-secondary-text)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
