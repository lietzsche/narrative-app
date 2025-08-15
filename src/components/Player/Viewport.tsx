import { useEffect, useState, type ReactNode } from 'react';
import type { Scene } from '../../lib/schema';

interface Props {
    scene: Scene;
    children?: ReactNode;
}

// 문자열 조합으로 BASE_URL-safe 경로 만들기 (브라우저 절대 URL 불필요)
const withBase = (p: string) => {
    const base = import.meta.env.BASE_URL || '/';
    return `${base.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`;
};

const placeholders = [
    'images/loading-background1.png',
    'images/loading-background2.png',
    'images/loading-background3.png',
    'images/loading-background4.png',
    'images/mountain.png',
].map(withBase);

let idx = 0;
function nextPlaceholder() {
    const img = placeholders[idx % placeholders.length];
    idx++;
    return img;
}

export default function Viewport({ scene, children }: Props) {
    const [bg, setBg] = useState('');

    useEffect(() => {
        const v = scene.backgroundImage?.trim();

        if (!v) {
            setBg(nextPlaceholder());
            return;
        }

        if (v.startsWith('data:') || /^https?:\/\//i.test(v)) {
            setBg(v); // data URL or 외부 URL
            return;
        }

        // public/images 기준 정규화
        const cleaned = v.replace(/^\/+/, ''); // 앞 슬래시 제거
        const underImages = cleaned.startsWith('images/')
            ? cleaned
            : `images/${cleaned}`;

        setBg(withBase(underImages)); // ✅ BASE_URL 적용
    }, [scene]);

    return (
        <div
            className="relative flex-1 min-h-[60vh] bg-cover bg-center text-white flex flex-col justify-center"
            style={{ backgroundImage: bg ? `url(${bg})` : undefined }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative max-w-2xl mx-auto p-6 space-y-4">
                <div className="space-y-2">
                    <div className="font-semibold">{scene.speaker}</div>
                    <div className="whitespace-pre-wrap">{scene.text}</div>
                </div>
                {children}
            </div>
        </div>
    );
}

