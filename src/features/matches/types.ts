export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface Match {
    id: string;
    date: Date;
    hero: string;
    role: 1 | 2 | 3 | 4 | 5;
    mmrChange: number;
    gameDifficulty: 'easy' | 'impossible' | 'self-impact';
    isTokenGame: boolean;
    result: 'win' | 'loss';
    moodStart: Mood;
    moodEnd: Mood;
    comment?: string;
}
