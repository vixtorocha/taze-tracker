'use client';

import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import HabitItem from './HabitItem';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type Props = {
    habits: Habit[];
    isCompleted: (habitId: string) => boolean;
    onToggle: (habitId: string) => void;
    onDelete: (habitId: string) => void;
    onReorder: (habits: Habit[]) => void;
    onRename: (habitId: string, newName: string) => void;
};

export default function HabitList({ habits, isCompleted, onToggle, onDelete, onReorder, onRename }: Props) {
    const sensors = useSensors(useSensor(PointerSensor));
    const sortedHabits = [...habits].sort((a, b) => a.order - b.order);
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sortedHabits.findIndex((habit) => habit.id === active.id);
        const newIndex = sortedHabits.findIndex((habit) => habit.id === over.id);

        const newOrder = arrayMove(sortedHabits, oldIndex, newIndex).map((habit, index) => ({ ...habit, order: index }));
        onReorder(newOrder);
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedHabits} strategy={verticalListSortingStrategy}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {sortedHabits.map((habit) => (
                        <HabitItem
                            key={habit.id}
                            id={habit.id}
                            name={habit.name}
                            completed={isCompleted(habit.id)}
                            onToggle={() => onToggle(habit.id)}
                            onDelete={() => onDelete(habit.id)}
                            onRename={onRename}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}
