'use client';

import { useState, useEffect } from 'react';

type HabitModalProps = {
  readonly isOpen: boolean;
  readonly mode: 'add' | 'edit';
  readonly initialName?: string;
  readonly initialColor?: string;
  readonly initialSectionId?: string;
  readonly sections?: Section[];
  readonly onClose: () => void;
  readonly onSave: (name: string, color: string, sectionId?: string) => void;
  readonly onDelete?: () => void;
};

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];

export default function HabitModal({
  isOpen,
  mode,
  initialName = '',
  initialColor = '#3B82F6',
  initialSectionId,
  sections = [],
  onClose,
  onSave,
  onDelete,
}: HabitModalProps) {
  const [title, setTitle] = useState(initialName);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSectionId, setSelectedSectionId] = useState(initialSectionId || undefined);

  useEffect(() => {
    setTitle(initialName);
    setSelectedColor(initialColor);
    setSelectedSectionId(initialSectionId || undefined);
  }, [initialName, initialColor, initialSectionId, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), selectedColor, selectedSectionId);
  };

  const handleDeleteClick = () => {
    if (onDelete && confirm('Are you sure you want to delete this habit?')) {
      onDelete();
    }
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
          padding: '32px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '90%',
          color: 'var(--foreground)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
          {mode === 'add' ? 'Add New Habit' : 'Edit Habit'}
        </h2>

        {/* Title Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter habit title...'
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: 'var(--input-bg)',
              color: 'var(--foreground)',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </div>

        {/* Color Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>Color</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: color,
                  border: selectedColor === color ? '3px solid var(--foreground)' : '2px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Section Selection */}
        {sections.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section</label>
            <select
              value={selectedSectionId || ''}
              onChange={(e) => setSelectedSectionId(e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--foreground)',
              }}
            >
              <option value=''>No Section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {mode === 'edit' && onDelete && (
            <button
              onClick={handleDeleteClick}
              style={{
                padding: '8px 16px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginRight: 'auto',
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--button-secondary)',
              color: 'var(--button-secondary-text)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {mode === 'add' ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
