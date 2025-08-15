import { useEffect } from 'react';
import type { Scene } from '../../lib/schema';
import { useSessionStore } from '../../stores/sessionStore';

interface Props {
    scene: Scene;
}

export default function ChoiceList({ scene }: Props) {
    const choose = useSessionStore((s) => s.choose);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const idx = parseInt(e.key, 10) - 1;
            if (!isNaN(idx) && scene.choiceRequests[idx]) {
                choose(scene.choiceRequests[idx]);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [scene, choose]);

    return (
        <div className="w-full p-4 space-y-2 bg-white/80 backdrop-blur-sm max-h-[40vh] overflow-y-auto rounded-md">
            {scene.choiceRequests.map((c, i) => (
                <button
                    key={i}
                    onClick={() => choose(c)}
                    className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-left transition focus-visible:outline-blue-500"
                >
                    {i + 1}. {c.text}
                </button>
            ))}
        </div>
    );
}