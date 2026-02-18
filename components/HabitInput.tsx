'use client';

import { useState } from 'react';

type Props = {
    onAdd: (name: string) => void;
};

export default function HabitInput({ onAdd }: Props) {
    const [value, setValue] = useState('');

    const handleAdd = () => {
        if (!value.trim()) return;
        onAdd(value.trim());
        setValue('');
    };

    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <input
                type="text"
                placeholder="Enter a habit..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{ flex: 1, padding: '8px' }}
                onKeyDown={(key) => {
                    if (key.key === 'Enter') {
                        handleAdd();
                    }
                }}
            />
            <button onClick={handleAdd}>Add</button>
        </div>
    );
}
