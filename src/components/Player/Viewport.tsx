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
            className="flex-1 flex flex-col justify-end bg-cover bg-center p-4 text-white"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="bg-black/50 p-4 rounded">
                <div className="font-semibold">{scene.speaker}</div>
                <div className="mt-2 whitespace-pre-wrap">{scene.text}</div>
            </div>
        </div>
    );
}