import { create } from 'zustand';
import type { Scene } from '../lib/schema';
import type { ValidationReport } from '../lib/graph';

interface AdminState {
    draftScenes: Scene[];
    report: ValidationReport | null;
    setDraft: (scenes: Scene[], report: ValidationReport) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    draftScenes: [],
    report: null,
    setDraft: (scenes, report) => set({ draftScenes: scenes, report }),
}));