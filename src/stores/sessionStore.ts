import { create } from 'zustand';
import type { Scene, ChoiceRequest } from '../lib/schema';
import { useContentStore } from './contentStore';

interface PathEntry {
    sceneId: string;
    prompt: string;
    choice: string;
    at: string;
}

interface SessionState {
    currentScene: Scene | null;
    path: PathEntry[];
    startedAt: string | null;
    endedAt: string | null;
    startSession: () => void;
    choose: (choice: ChoiceRequest) => void;
    reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    currentScene: null,
    path: [],
    startedAt: null,
    endedAt: null,
    startSession: () => {
        const { scenes } = useContentStore.getState();
        const startScene = scenes.find((s) => s.start);
        if (startScene) {
            set({ currentScene: startScene, path: [], startedAt: new Date().toISOString(), endedAt: null });
        }
    },
    choose: (choice) => {
        const { currentScene } = get();
        const { sceneMap } = useContentStore.getState();
        if (!currentScene) return;
        const next = choice.nextSceneId ? sceneMap[choice.nextSceneId] : undefined;
        const entry: PathEntry = {
            sceneId: currentScene.sceneId,
            prompt: `${currentScene.speaker}: ${currentScene.text}`,
            choice: choice.text,
            at: new Date().toISOString(),
        };
        if (next) {
            set((state) => ({ currentScene: next, path: [...state.path, entry] }));
        } else {
            set((state) => ({
                currentScene: { ...currentScene, end: true, choiceRequests: [] },
                path: [...state.path, entry],
                endedAt: new Date().toISOString(),
            }));
        }
    },
    reset: () => set({ currentScene: null, path: [], startedAt: null, endedAt: null }),
}));