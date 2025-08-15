import { useEffect } from 'react';
import Viewport from '../components/Player/Viewport';
import ChoiceList from '../components/Player/ChoiceList';
import ProgressBar from '../components/Player/ProgressBar';
import SummaryView from '../components/Player/SummaryView';
import { useSessionStore } from '../stores/sessionStore';
import { useContentStore } from '../stores/contentStore';

export default function PlayPage() {
    const { currentScene, startSession } = useSessionStore();
    const { scenes } = useContentStore();

    useEffect(() => {
        if (scenes.length && !currentScene) {
            startSession();
        }
    }, [scenes, currentScene, startSession]);

    if (!scenes.length) {
        return <div className="p-4">No content uploaded.</div>;
    }

    if (!currentScene) {
        return <div className="p-4">Loading...</div>;
    }

    if (currentScene.end) {
        return <SummaryView />;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 pb-4">
            <ProgressBar />
            <Viewport scene={currentScene} />
            <ChoiceList scene={currentScene} />
        </div>
    );
}