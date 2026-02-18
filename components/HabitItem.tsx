'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';

type Props = {
    id: string;
    name: string;
    completed: boolean;
    onToggle: () => void;
    onDelete: () => void;
    onRename: (id: string, newName: string) => void;
};

export default function HabitItem({ id, name, completed, onToggle, onDelete, onRename }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(name);
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '10px',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        touchAction: 'none',
    };
    const saveEdit = () => {
        if (!draft.trim()) return;
        onRename(id, draft.trim());
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setDraft(name);
        setIsEditing(false);
    };

    return (
        <li ref={setNodeRef} style={style}>
            {isEditing ? (
                <>
                    <input value={draft} onChange={(e) => setDraft(e.target.value)} style={{ flex: 1, padding: '4px' }} />
                    <button onClick={saveEdit} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                        Save
                    </button>
                    <button onClick={cancelEdit} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0' }}
                    >
                        Delete
                    </button>
                </>
            ) : (
                <>
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={onToggle}
                        className="rounded h-5 w-5 accent-blue-600 cursor-pointer"
                    />
                    <span
                        onClick={() => setIsEditing(true)}
                        className={`cursor-pointer transition-all ${completed ? 'line-through text-gray-400' : ''}`}
                    >
                        {name}
                    </span>
                    <span {...attributes} {...listeners} style={{ cursor: 'grab', padding: '4px', marginLeft: 'auto' }}>
                        ::
                    </span>
                </>
            )}
        </li>
    );
}
