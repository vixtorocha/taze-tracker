type Habit = {
  id: string;
  user_id: string;
  name: string;
  createdAt: string;
  order: number;
  color?: string;
  sectionId?: string;
};

type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  value: boolean | number;
};

type Section = {
  id: string;
  name: string;
  order: number;
  user_id: string;
};
