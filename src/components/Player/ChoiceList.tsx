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
        <div className="p-4 grid gap-2">
            {scene.choiceRequests.map((c, i) => (
                <button
                    key={i}
                    onClick={() => choose(c)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-left"
                >
                    {i + 1}. {c.text}
                </button>
            ))}
        </div>
    );
}