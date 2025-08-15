import { clearContent } from './lib/storage';
import { useContentStore } from './stores/contentStore';

export async function initContent() {
    // Remove any previously stored content
    useContentStore.getState().clear();
    await clearContent();
    localStorage.removeItem('content-store');

    try {
        const resp = await fetch('/content.json');
        const scenes = await resp.json();
        useContentStore.getState().publish(scenes, 'default');
    } catch (e) {
        console.error('Failed to load default content', e);
    }
}
