import { useSessionStore } from '../../stores/sessionStore';
import { useContentStore } from '../../stores/contentStore';

export default function ProgressBar() {
    const step = useSessionStore((s) => s.path.length + 1);
    const total = useContentStore((s) => s.scenes.length || 1);
    const pct = Math.min(100, (step / total) * 100);
    return (
        <div className="h-2 bg-gray-300">
            <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}