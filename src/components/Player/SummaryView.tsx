// SummaryView.tsx (발췌)
import { useMemo } from 'react';
import { analyzeBySceneIds } from '../analysis/bundleAnalyzer';
import {exportSessionJSON, sessionToText} from "../../lib/export";
import {useSessionStore} from "../../stores/sessionStore";
import {useContentStore} from "../../stores/contentStore";

export default function SummaryView() {
    const session = useSessionStore();
    const version = useContentStore((s) => s.version) || '';

    const sceneIds = session.path.map((p) => p.sceneId);

    const analysis = useMemo(() => analyzeBySceneIds(sceneIds), [sceneIds]);

    const copy = () => navigator.clipboard.writeText(sessionToText());
    const restart = () => { session.reset(); session.startSession(); };

    return (
        <div className="p-4 space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-center">Summary</h2>

            {/* 경로 */}
            <ul className="space-y-2">
                {session.path.map((p, i) => (
                    <li key={i} className="border-b pb-2">
                        <div className="font-semibold">{p.sceneId}</div>
                        <div>{p.prompt}</div>
                        <div className="text-sm text-gray-600">Choice: {p.choice}</div>
                    </li>
                ))}
            </ul>

            {/* 성향 결과 */}
            <div className="rounded-xl border p-3 space-y-2">
                <div className="font-semibold">Persona Tags</div>
                <div className="flex flex-wrap gap-2">
                    {analysis.tags.length ? analysis.tags.map((t, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">{t}</span>
                    )) : <span className="text-gray-500 text-sm">표시할 태그 없음</span>}
                </div>
                <div className="text-sm text-gray-700">{analysis.summary}</div>
            </div>

            {/* 필요하다면 점수 디버그 */}
            {/*<details className="text-sm">
                <summary className="cursor-pointer">Trait Scores (debug)</summary>
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(analysis.scores, null, 2)}</pre>
            </details>*/}

            {/*<p className="break-all text-xs text-gray-500">{sceneIds.join(', ')}</p>*/}

            <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => exportSessionJSON(version)}>
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
