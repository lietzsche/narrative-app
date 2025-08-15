import { useEffect, useState } from 'react';
import type { Scene } from '../../lib/schema';

interface Props {
    scene: Scene;
}

const placeholders = [
    '/src/assets/images/placeholder-1.png',
    '/src/assets/images/placeholder-2.png',
    '/src/assets/images/placeholder-3.png',
    '/src/assets/images/placeholder-4.png',
    '/src/assets/images/placeholder-5.png',
];
let idx = 0;
function nextPlaceholder() {
    const img = placeholders[idx % placeholders.length];
    idx++;
    return img;
}

export default function Viewport({ scene }: Props) {
    const [bg, setBg] = useState('');
    useEffect(() => {
        if (!scene.backgroundImage) {
            setBg(nextPlaceholder());
        } else if (scene.backgroundImage.startsWith('data:')) {
            setBg(scene.backgroundImage);
        } else {
            setBg(`/src/assets/images/${scene.backgroundImage}`);
        }
    }, [scene]);
    return (
        <div
            className="relative flex-1 bg-cover bg-center text-white flex flex-col justify-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative max-w-2xl mx-auto p-6 space-y-2">
                <div className="font-semibold">{scene.speaker}</div>
                <div className="whitespace-pre-wrap">{scene.text}</div>
            </div>
        </div>
    );
}