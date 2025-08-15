import { useSessionStore } from '../../stores/sessionStore';
import { useContentStore } from '../../stores/contentStore';
import { exportSessionJSON, sessionToText } from '../../lib/export';

export default function SummaryView() {
    const session = useSessionStore();
    const version = useContentStore((s) => s.version) || '';
    const copy = () => {
        navigator.clipboard.writeText(sessionToText());
    };
    const restart = () => {
        session.reset();
        session.startSession();
    };
    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center">Summary</h2>
            <ul className="space-y-2">
                {session.path.map((p, i) => (
                    <li key={i} className="border-b pb-2">
                        <div className="font-semibold">{p.sceneId}</div>
                        <div>{p.prompt}</div>
                        <div className="text-sm text-gray-600">Choice: {p.choice}</div>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-2">
                <button
                    className="flex-1 px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => exportSessionJSON(version)}
                >
                    Download JSON
                </button>
                <button className="flex-1 px-3 py-1 bg-gray-300 rounded" onClick={copy}>
                    Copy Text
                </button>
            </div>
            <button className="w-full px-3 py-1 bg-green-600 text-white rounded" onClick={restart}>
                Restart
            </button>
        </div>
    );
}