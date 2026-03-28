'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

type Habit = {
  id: string;
  name: string;
  days: boolean[]; // 7 days, true if completed
  streak: number;
};

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Code 2 hours',
      days: [true, true, true, true, false, false, false],
      streak: 4,
    },
    {
      id: '2',
      name: 'Exercise',
      days: [true, false, true, true, false, false, false],
      streak: 3,
    },
    {
      id: '3',
      name: 'Read tech articles',
      days: [true, true, true, false, false, false, false],
      streak: 3,
    },
    {
      id: '4',
      name: 'Portfolio work',
      days: [true, true, true, true, false, false, false],
      streak: 4,
    },
  ]);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleHabit = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newDays = [...habit.days];
        newDays[dayIndex] = !newDays[dayIndex];
        
        // Recalculate streak
        let streak = 0;
        for (let i = newDays.length - 1; i >= 0; i--) {
          if (newDays[i]) streak++;
          else break;
        }
        
        return { ...habit, days: newDays, streak };
      }
      return habit;
    }));
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Habit Tracker</CardTitle>
        <CardDescription className="text-slate-400">
          Build your coding streak! 🔥
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-40 text-sm font-semibold text-slate-400">Habit</div>
            <div className="flex gap-3">
              {days.map((day, i) => (
                <div key={i} className="w-10 text-center text-sm font-semibold text-slate-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="ml-auto text-sm font-semibold text-slate-400">Streak</div>
          </div>

          {/* Habits */}
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-4">
              <div className="w-40 text-sm text-slate-200">{habit.name}</div>
              <div className="flex gap-3">
                {habit.days.map((completed, dayIndex) => (
                  <div key={dayIndex} className="w-10 flex justify-center">
                    <Checkbox
                      checked={completed}
                      onCheckedChange={() => toggleHabit(habit.id, dayIndex)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                  </div>
                ))}
              </div>
              <div className="ml-auto">
                <Badge variant={habit.streak >= 3 ? "default" : "secondary"}>
                  {habit.streak} {habit.streak >= 3 ? '🔥' : ''}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}