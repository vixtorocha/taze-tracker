type Habit = {
    id: string;
    user_id: string;
    name: string;
    createdAt: string;
    order: number;
};

type HabitLog = {
    id: string;
    habit_id: string;
    user_id: string;
    date: string;
    value: boolean | number;
};
