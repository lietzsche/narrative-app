import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scene } from '../lib/schema';

interface ContentState {
    version: string | null;
    scenes: Scene[];
    sceneMap: Record<string, Scene>;
    publish: (scenes: Scene[], version: string) => void;
    clear: () => void;
}

export const useContentStore = create<ContentState>()(
    persist(
        (set) => ({
            version: null,
            scenes: [],
            sceneMap: {},
            publish: (scenes, version) =>
                set({
                    version,
                    scenes,
                    sceneMap: Object.fromEntries(scenes.map((s) => [s.sceneId, s])),
                }),
            clear: () => set({ version: null, scenes: [], sceneMap: {} }),
        }),
        { name: 'content-store' }
    )
);