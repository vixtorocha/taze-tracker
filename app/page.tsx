'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import HabitInput from '@/components/HabitInput';
import SectionView from '@/components/SectionView';
import SectionManager from '@/components/SectionManager';

const USER_ID = 'user-1';

export default function Home() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [logs, setLogs] = useLocalStorage<HabitLog[]>('habit_logs', []);
  const [sections, setSections] = useLocalStorage<Section[]>('sections', []);
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);

  // Get today's date in the user's local timezone
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getToday();

  const addHabit = (name: string, color: string = '#3B82F6', sectionId?: string) => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      color,
      user_id: USER_ID,
      createdAt: new Date().toISOString(),
      order: habits.filter((h) => !h.sectionId).length,
      sectionId: sectionId || undefined, // Add to specified section or "No Section" by default
    };

    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (habitId: string) => {
    const existingLog = logs.find((log) => log.habit_id === habitId && log.user_id === USER_ID && log.date === today);

    if (existingLog) {
      setLogs(logs.map((log) => (log.id === existingLog.id ? { ...log, value: !log.value } : log)));
    } else {
      const newLog: HabitLog = {
        id: uuidv4(),
        habit_id: habitId,
        user_id: USER_ID,
        date: today,
        value: true,
      };

      setLogs([...logs, newLog]);
    }
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
    setLogs(logs.filter((log) => log.habit_id !== habitId));
  };

  const reorderHabits = (newOrder: Habit[]) => {
    setHabits(newOrder);
  };

  const renameHabit = (habitId: string, newName: string, newColor?: string, newSectionId?: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              name: newName,
              color: newColor || habit.color,
              sectionId: newSectionId !== undefined ? newSectionId : habit.sectionId,
            }
          : habit,
      ),
    );
  };

  const moveHabitToSection = (habitId: string, sectionId: string | undefined) => {
    setHabits(habits.map((habit) => (habit.id === habitId ? { ...habit, sectionId } : habit)));
  };

  const addSection = (name: string) => {
    const newSection: Section = {
      id: uuidv4(),
      name,
      order: sections.length,
      user_id: USER_ID,
    };
    setSections([...sections, newSection]);
  };

  const saveSections = (updatedSections: Section[]) => {
    // Find deleted sections
    const deletedSectionIds = sections
      .filter((s) => s.name !== 'No Section')
      .map((s) => s.id)
      .filter((id) => !updatedSections.find((s) => s.id === id));

    // Move habits from deleted sections to "No Section"
    if (deletedSectionIds.length > 0) {
      setHabits(
        habits.map((habit) =>
          deletedSectionIds.includes(habit.sectionId as string) ? { ...habit, sectionId: undefined } : habit,
        ),
      );
    }

    // Ensure "No Section" is always first
    const noSectionIndex = updatedSections.findIndex((s) => s.name === 'No Section');
    if (noSectionIndex > 0) {
      const noSection = updatedSections[noSectionIndex];
      const otherSections = updatedSections.filter((s) => s.name !== 'No Section');
      setSections([{ ...noSection, order: 0 }, ...otherSections]);
    } else {
      setSections(updatedSections);
    }
  };

  const isCompleted = (habitId: string) => {
    return logs.some(
      (log) => log.habit_id === habitId && log.user_id === USER_ID && log.date === today && log.value === true,
    );
  };

  return (
    <main className='p-0.5 pt-5 pb-20 max-w-160 my-0 mx-auto'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ textAlign: 'center', flex: 1, marginBottom: 0, fontSize: '1.3rem' }}>Taze Tracker</h1>
        <button
          onClick={() => setIsSectionManagerOpen(true)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
          title='Manage sections'
        >
          ⚙️
        </button>
      </div>

      <HabitInput onAdd={addHabit} sections={sections} />

      <SectionView
        habits={habits}
        sections={sections}
        isCompleted={isCompleted}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
        onReorder={reorderHabits}
        onRename={renameHabit}
        onMoveToSection={moveHabitToSection}
      />

      <SectionManager
        isOpen={isSectionManagerOpen}
        sections={sections}
        onClose={() => setIsSectionManagerOpen(false)}
        onSave={saveSections}
        onAddSection={addSection}
      />
    </main>
  );
}
