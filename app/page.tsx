'use client';

import { useEffect, useState } from 'react';

const USER_ID = 'user-1';

export default function Home() {
    const [habitName, setHabitName] = useState('');

    const today = new Date().toISOString().split('T')[0];

    // Load from localStorage
    const [habits, setHabits] = useState<Habit[]>(() => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('habits');
        return stored ? JSON.parse(stored) : [];
    });

    const [logs, setLogs] = useState<HabitLog[]>(() => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('habit_logs');
        return stored ? JSON.parse(stored) : [];
    });

    // Persist
    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    useEffect(() => {
        localStorage.setItem('habit_logs', JSON.stringify(logs));
    }, [logs]);

    const addHabit = () => {
        if (!habitName.trim()) return;

        const newHabit: Habit = {
            id: crypto.randomUUID(),
            user_id: USER_ID,
            name: habitName.trim(),
            createdAt: new Date().toISOString(),
        };

        setHabits([...habits, newHabit]);
        setHabitName('');
    };

    const toggleHabit = (habitId: string) => {
        const existingLog = logs.find((log) => log.habit_id === habitId && log.user_id === USER_ID && log.date === today);

        if (existingLog) {
            // Toggle existing
            const updatedLogs = logs.map((log) => (log.id === existingLog.id ? { ...log, value: !log.value } : log));
            setLogs(updatedLogs);
        } else {
            // Create new log
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

    const isHabitCompletedToday = (habitId: string) => {
        return logs.some((log) => log.habit_id === habitId && log.user_id === USER_ID && log.date === today && log.value === true);
    };

    return (
        <main style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
            <h1>Taze Tracker</h1>

            {/* Add Habit */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Enter a habit..."
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={addHabit} style={{ padding: '8px 12px' }}>
                    Add
                </button>
            </div>

            {/* Habit List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {habits.map((habit) => (
                    <li
                        key={habit.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '10px',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                        }}
                    >
                        <input type="checkbox" checked={isHabitCompletedToday(habit.id)} onChange={() => toggleHabit(habit.id)} />
                        <span>{habit.name}</span>
                    </li>
                ))}
            </ul>
        </main>
    );
}
