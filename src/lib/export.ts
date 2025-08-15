import { useSessionStore } from '../stores/sessionStore';

export function exportSessionJSON(version: string) {
    const session = useSessionStore.getState();
    const data = {
        version,
        sessionId: crypto.randomUUID(),
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        path: session.path,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journey-${new Date().toISOString().replace(/[:]/g, '').slice(0,15)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function sessionToText(): string {
    const { path } = useSessionStore.getState();
    return path
        .map((p) => `${p.sceneId} | ${p.prompt}\n> ${p.choice}`)
        .join('\n\n');
}