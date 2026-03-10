'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import HabitItem from './HabitItem';
import DragPlaceholder from './DragPlaceholder';
import CustomCheckbox from './CustomCheckbox';
import { useState } from 'react';

type Props = {
  readonly habits: Habit[];
  readonly sections: Section[];
  readonly isCompleted: (habitId: string) => boolean;
  readonly onToggle: (habitId: string) => void;
  readonly onDelete: (habitId: string) => void;
  readonly onReorder: (habits: Habit[]) => void;
  readonly onRename: (habitId: string, newName: string, color?: string, sectionId?: string) => void;
  readonly onMoveToSection: (habitId: string, sectionId: string | undefined) => void;
};

export default function SectionView({
  habits,
  sections,
  isCompleted,
  onToggle,
  onDelete,
  onReorder,
  onRename,
  onMoveToSection,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null | number>(null);

  const habitsBySection = (sectionId: string | undefined) => {
    return habits
      .filter((habit) => {
        // For "No Section", include habits with undefined sectionId OR with non-existent section IDs
        if (sectionId === undefined) {
          const sectionExists = sections.some((s) => s.id === habit.sectionId);
          return !habit.sectionId || !sectionExists;
        }
        // For other sections, only include exact matches
        return habit.sectionId === sectionId;
      })
      .sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setOverId(null);
    const { active, over } = event;

    if (!over) return;

    const activeHabit = habits.find((h) => h.id === active.id);
    if (!activeHabit) return;

    // If dragging over a section, move habit to that section
    if (over.id.toString().startsWith('section-')) {
      const sectionId = over.id === 'section-no-section' ? undefined : (over.id as string).replace('section-', '');
      if (activeHabit.sectionId !== sectionId) {
        onMoveToSection(activeHabit.id, sectionId);
      }
      return;
    }

    // If dragging over a habit
    const overHabit = habits.find((h) => h.id === over.id);
    if (!overHabit) return;

    // Case 1: Reordering within the same section
    if (activeHabit.sectionId === overHabit.sectionId) {
      const sectionHabits = habitsBySection(activeHabit.sectionId);
      const oldIndex = sectionHabits.findIndex((h) => h.id === active.id);
      const newIndex = sectionHabits.findIndex((h) => h.id === over.id);

      if (oldIndex === newIndex) return;

      // Reorder habits within the section
      const reorderedHabits = Array.from(sectionHabits);
      const [movedHabit] = reorderedHabits.splice(oldIndex, 1);
      reorderedHabits.splice(newIndex, 0, movedHabit);

      // Update order values for all habits in the section
      const updatedSectionHabits = reorderedHabits.map((h, idx) => ({
        ...h,
        order: idx,
      }));

      // Update all habits, preserving non-section habits
      const updatedHabits = habits.map((h) => {
        const updated = updatedSectionHabits.find((uh) => uh.id === h.id);
        return updated ?? h;
      });

      onReorder(updatedHabits);
      return;
    }

    // Create a copy of the active habit with the new section ID
    const movedHabit = {
      ...activeHabit,
      sectionId: overHabit.sectionId,
    };

    // Remove active habit from its current section
    const updatedHabits = habits.filter((h) => h.id !== activeHabit.id);

    // Insert the habit into the target section at the correct position
    const targetSectionAllHabits = updatedHabits.filter((h) => h.sectionId === overHabit.sectionId);
    const insertPosition = targetSectionAllHabits.findIndex((h) => h.id === over.id);

    // Add the moved habit and reorder all habits in the target section
    const newTargetSectionHabits = [
      ...targetSectionAllHabits.slice(0, insertPosition),
      movedHabit,
      ...targetSectionAllHabits.slice(insertPosition),
    ];

    // Update order values for habits in the target section
    const updatedTargetSectionHabits = newTargetSectionHabits.map((h, idx) => ({
      ...h,
      order: idx,
    }));

    // Build final habits array
    const finalHabits = updatedHabits
      .filter((h) => h.sectionId !== overHabit.sectionId)
      .concat(updatedTargetSectionHabits);

    onReorder(finalHabits);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div style={{ marginTop: '.5rem' }}>
        {/* No Section */}
        {habitsBySection(undefined).length > 0 && (
          <Section
            sectionName='No Section'
            sectionId={undefined}
            habits={habitsBySection(undefined)}
            sections={sections}
            isCompleted={isCompleted}
            onToggle={onToggle}
            onDelete={onDelete}
            onRename={onRename}
            overId={overId}
            activeId={activeId}
            allHabits={habits}
          />
        )}

        {/* Other Sections */}
        {sections
          .filter((s) => s.name !== 'No Section')
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <Section
              key={section.id}
              sectionName={section.name}
              sectionId={section.id}
              habits={habitsBySection(section.id)}
              sections={sections}
              isCompleted={isCompleted}
              onToggle={onToggle}
              onDelete={onDelete}
              onRename={onRename}
              overId={overId}
              activeId={activeId}
              allHabits={habits}
            />
          ))}

        {/* Habit being dragged */}
        <DragOverlay>
          {activeId
            ? (() => {
                const draggedHabit = habits.find((h) => h.id === activeId);
                return draggedHabit ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      cursor: 'grabbing',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CustomCheckbox
                      checked={isCompleted(draggedHabit.id)}
                      onChange={() => {}}
                      color={draggedHabit.color || '#3B82F6'}
                    />
                    <span>{draggedHabit.name}</span>
                  </div>
                ) : null;
              })()
            : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

function Section({
  sectionName,
  sectionId,
  habits,
  sections,
  isCompleted,
  onToggle,
  onDelete,
  onRename,
  overId,
  activeId,
  allHabits = [],
}: {
  readonly sectionName: string;
  readonly sectionId: string | undefined;
  readonly habits: Habit[];
  readonly sections: Section[];
  readonly isCompleted: (habitId: string) => boolean;
  readonly onToggle: (habitId: string) => void;
  readonly onDelete: (habitId: string) => void;
  readonly onRename: (habitId: string, newName: string, color?: string, sectionId?: string) => void;
  readonly overId?: string | null | number;
  readonly activeId?: string | null;
  readonly allHabits?: Habit[];
}) {
  const droppableId = sectionId ? `section-${sectionId}` : 'section-no-section';
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
  });

  const isSectionOver = isOver && overId === droppableId;

  // Check if we're dragging a habit from another section
  const activeHabit = activeId ? allHabits.find((h) => h.id === activeId) : null;
  const isDraggingFromAnotherSection = activeHabit && activeHabit.sectionId !== sectionId;
  const overHabit = overId ? allHabits.find((h) => h.id === overId) : null;
  const isOverHabitInThisSection = overHabit && overHabit.sectionId === sectionId;

  // For cross-section drags, find insertion index
  let placeholderIndex = -1;
  if (isDraggingFromAnotherSection && isOverHabitInThisSection && overId) {
    placeholderIndex = habits.findIndex((h) => h.id === overId);
  }

  return (
    <div
      ref={setNodeRef}
      id={droppableId}
      style={{
        marginBottom: '.5rem',
        padding: '12px',
        minHeight: '60px',
        backgroundColor: isSectionOver && activeId ? '#f8f8f8' : 'transparent',
        borderRadius: '4px',
        border: isSectionOver && activeId ? '2px dashed #3b82f6' : '2px dashed transparent',
        transition: 'all 0.15s ease-in-out',
      }}
    >
      <h3 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: '#919397', fontWeight: '600' }}>
        {sectionName}
        {habits.length > 0 && <span style={{ marginLeft: '8px', color: '#919397' }}>({habits.length})</span>}
      </h3>

      <SortableContext items={habits} strategy={verticalListSortingStrategy}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {habits.map((habit, index) => {
            // Render placeholder before this habit if it's the insertion point
            const isPlaceholderInsertionPoint = placeholderIndex === index;

            return (
              <div key={`habit-${habit.id}`}>
                {isPlaceholderInsertionPoint && (
                  <DragPlaceholder name={habit.name} color={habit.color} completed={isCompleted(habit.id)} />
                )}
                <HabitItem
                  id={habit.id}
                  name={habit.name}
                  color={habit.color}
                  completed={isCompleted(habit.id)}
                  sectionId={habit.sectionId}
                  sections={sections}
                  onToggle={() => onToggle(habit.id)}
                  onDelete={() => onDelete(habit.id)}
                  onRename={onRename}
                  isDropHover={!!(overId === habit.id && activeId && activeId !== habit.id)}
                  isDragging={activeId === habit.id}
                />
              </div>
            );
          })}
        </ul>
      </SortableContext>

      {habits.length === 0 && (
        <p style={{ margin: 0, color: '#d1d5db', fontSize: '0.875rem', fontStyle: 'italic' }}>
          Drag habits here or create new ones
        </p>
      )}
    </div>
  );
}
