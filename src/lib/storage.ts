import { get, set, del } from 'idb-keyval';

export async function saveContent(version: string, scenes: unknown) {
    try {
        await set('content', { version, scenes });
    } catch (e) {
        localStorage.setItem('content', JSON.stringify({ version, scenes }));
    }
}

export async function loadContent(): Promise<{ version: string; scenes: any } | null> {
    try {
        const data = await get<{ version: string; scenes: any }>('content');
        if (data) return data;
    } catch (e) {
        const raw = localStorage.getItem('content');
        if (raw) return JSON.parse(raw);
    }
    return null;
}

export async function clearContent() {
    try {
        await del('content');
    } catch (e) {
        localStorage.removeItem('content');
    }
}