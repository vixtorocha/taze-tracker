'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import HabitInput from '@/components/HabitInput';
import HabitList from '@/components/HabitList';

const USER_ID = 'user-1';

export default function Home() {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const [logs, setLogs] = useLocalStorage<HabitLog[]>('habit_logs', []);

    const today = new Date().toISOString().split('T')[0];

    const addHabit = (name: string) => {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            name,
            user_id: USER_ID,
            createdAt: new Date().toISOString(),
            order: habits.length, // New habit goes to the end of the list
        };

        setHabits([...habits, newHabit]);
    };

    const toggleHabit = (habitId: string) => {
        const existingLog = logs.find((log) => log.habit_id === habitId && log.user_id === USER_ID && log.date === today);

        if (existingLog) {
            setLogs(logs.map((log) => (log.id === existingLog.id ? { ...log, value: !log.value } : log)));
        } else {
            const newLog: HabitLog = {
                id: crypto.randomUUID(),
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

    const renameHabit = (habitId: string, newName: string) => {
        console.log('Renaming habit', habitId, 'to', newName);
        setHabits(habits.map((habit) => (habit.id === habitId ? { ...habit, name: newName } : habit)));
    };

    const isCompleted = (habitId: string) => {
        return logs.some((log) => log.habit_id === habitId && log.user_id === USER_ID && log.date === today && log.value === true);
    };

    return (
        <main style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Habit Tracker</h1>

            <HabitInput onAdd={addHabit} />

            <HabitList
                habits={habits}
                isCompleted={isCompleted}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
                onReorder={reorderHabits}
                onRename={renameHabit}
            />
        </main>
    );
}
