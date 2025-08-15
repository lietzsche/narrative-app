import { clearContent } from './lib/storage';
import { useContentStore } from './stores/contentStore';

export async function initContent() {
    // Remove any previously stored content
    useContentStore.getState().clear();
    await clearContent();
    localStorage.removeItem('content-store');

    try {
        const url = `${import.meta.env.BASE_URL}content.json`; // ✅ '/narrative-app/content.json'
        console.log('[initContent] fetching:', url);            // 디버그용
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} @ ${resp.url}`);
        }
        const scenes = await resp.json();
        useContentStore.getState().publish(scenes, 'default');
    } catch (e) {
        console.error('Failed to load default content', e);
    }
}
