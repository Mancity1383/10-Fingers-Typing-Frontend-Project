import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserProgressState {
    scores: Record<number, number>;
    presets: {
        id: number;
        title: string;
        text: string;
        difficulty: "Easy" | "Medium" | "Hard";
        length: "Short" | "Medium" | "Long";
        tags: string[];
    }[];
}

const initialState: UserProgressState = {
    scores: { 1: 2 },
    presets: [
        {
            id: 1,
            title: "Warmup – Hello World",
            text: "Hello world! This is a simple typing warmup to get your fingers moving.",
            difficulty: "Easy",
            length: "Short",
            tags: ["warmup", "beginner"],
        },
        {
            id: 2,
            title: "Productivity Focus",
            text: "Staying focused while typing helps improve accuracy and speed over time.",
            difficulty: "Medium",
            length: "Medium",
            tags: ["focus", "accuracy"],
        },
        {
            id: 3,
            title: "Code Style Snippet",
            text: `function typingPractice() {
return "Train your fingers to write clean and consistent code.";
}`,
            difficulty: "Hard",
            length: "Medium",
            tags: ["code", "symbols"],
        },
    ],
};

const userProgressSlice = createSlice({
    name: "userProgress",
    initialState,
    reducers: {
        updateScore(state, action: PayloadAction<{ id: number; score: number }>) {
            const { id, score } = action.payload;
            const currentScore = state.scores[id] || 0;

            if (score > currentScore) {
                state.scores[id] = score;
            }
        },
        resetProgress(state) {
            state.scores = {};
        },
        addPreset(state, action: PayloadAction<{ title: string; text: string; difficulty: "Easy" | "Medium" | "Hard"; length: "Short" | "Medium" | "Long"; tags: string[] }>) {
            const newPreset = {
                id: state.presets.length + 1,
                ...action.payload,
            };
            state.presets.push(newPreset);
        }
    },
});

export const { updateScore, resetProgress, addPreset } = userProgressSlice.actions;

export default userProgressSlice.reducer;