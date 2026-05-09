import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CharResultPayload {
    expected: string;
    typed: string;
}

interface KeyboardState {
    activeKeys: string[];
    mainText : string;
    correctCount: number;
    wrongCount: number;
    wrongKeys: string[];
    totalChars: number;
    typedChars: number;
    accuracy: number;
    speed: number;
    failCount: number;
    elapsedTime: number;
    isRunning: boolean;
    restartKey: number,
    currentIndex: number;
    activePresetId : number,
}

const initialState: KeyboardState = {
    activeKeys: [],
    correctCount: 0,
    mainText : "Hello everyone This is a default text",
    wrongCount: 0,
    wrongKeys: [],
    totalChars: 0,
    typedChars: 0,
    accuracy: 100,
    speed: 0,
    failCount: 0,
    restartKey: 0,
    elapsedTime: 0,
    isRunning: false,
    currentIndex: 0,
    activePresetId : 1,
};

const keyboardSlice = createSlice({
    name: "keyboard",
    initialState,
    reducers: {

        setTotalChars(state, action: PayloadAction<number>) {
            state.totalChars = action.payload;
        },
        setIsRunning(state, action: PayloadAction<boolean>) {
            state.isRunning = action.payload;
        },
        setMainText(state, action: PayloadAction<string>){
            state.mainText = action.payload;
        },
        resetGame(state) {
            state.activeKeys = [];
            state.correctCount = 0;
            state.wrongCount = 0;
            state.wrongKeys = [];

            state.typedChars = 0;
            state.accuracy = 100;
            state.speed = 0;
            state.failCount = 0;
            state.restartKey += 1;

            state.elapsedTime = 0;
            state.isRunning = false;
            state.currentIndex = 0;
        },

        setCurrentIndex(state, action: PayloadAction<number>) {
            state.currentIndex = action.payload;
            if(state.currentIndex == state.totalChars){
                state.isRunning=false
            }
        },

        addActiveKey(state, action: PayloadAction<string>) {
            const key = action.payload;
            if (!state.activeKeys.includes(key)) {
                state.activeKeys.push(key);
            }
        },
        removeActiveKey(state, action: PayloadAction<string>) {
            state.activeKeys = state.activeKeys.filter((k) => k !== action.payload);
        },
        cleanActiveKey(state){
            state.activeKeys = []
        },
        addWrongKey(state, action: PayloadAction<string>) {
            const key = action.payload.toUpperCase();
            if (!state.wrongKeys.includes(key)) {
                state.wrongKeys.push(key);
            }
        },
        removeWrongKey(state) {
            state.wrongKeys = [];
        },

        addCharResult(state, action: PayloadAction<CharResultPayload>) {
            const { expected, typed } = action.payload;
            const isCorrect = expected === typed;

            state.typedChars += 1;

            if (isCorrect) {
                state.correctCount += 1;
            } else {
                state.wrongCount += 1;
                state.failCount += 1;
                state.wrongKeys.push(typed.toUpperCase());
            }

            const total = state.correctCount + state.wrongCount;
            if (total > 0) {
                state.accuracy = Math.round((state.correctCount / total) * 100);
            } else {
                state.accuracy = 100;
            }
        },

        removeCharResult(state, action: PayloadAction<CharResultPayload>) {
            const { expected, typed } = action.payload;
            const isCorrect = expected === typed;

            if (state.typedChars > 0) state.typedChars -= 1;

            if (isCorrect) {
                if (state.correctCount > 0) state.correctCount -= 1;
            } else {
                if (state.wrongCount > 0) state.wrongCount -= 1;
            }

            const total = state.correctCount + state.wrongCount;
            if (total > 0) {
                state.accuracy = Math.round((state.correctCount / total) * 100);
            } else {
                state.accuracy = 100;
            }
        },

        incrementElapsedTime(state) {
            state.elapsedTime += 1;

            if (state.elapsedTime > 0) {
                const wpm = (state.typedChars * 12) / state.elapsedTime;
                state.speed = Math.round(state.speed * 0.7 + wpm * 0.3);

            } else {
                state.speed = 0;
            }
        },

        updateActivePresetId(state, action: PayloadAction<number>) {
            state.activePresetId = action.payload;
        }
    },
});

export const {
    setTotalChars,
    setIsRunning,
    setMainText,
    resetGame,
    setCurrentIndex,
    addActiveKey,
    removeActiveKey,
    addCharResult,
    removeCharResult,
    addWrongKey,
    removeWrongKey,
    incrementElapsedTime,
    cleanActiveKey,
    updateActivePresetId,
} = keyboardSlice.actions;

export default keyboardSlice.reducer;
