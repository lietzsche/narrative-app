import { useState } from 'react';
import { sceneArraySchema } from '../lib/schema';
import { validateGraph } from '../lib/graph';
import { useAdminStore } from '../stores/adminStore';
import { useContentStore } from '../stores/contentStore';
import { saveContent } from '../lib/storage';

export default function AdminUploader() {
    const { draftScenes, report, setDraft } = useAdminStore();
    const publish = useContentStore((s) => s.publish);
    const [error, setError] = useState<string | null>(null);

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const scenes = sceneArraySchema.parse(json);
            const r = validateGraph(scenes);
            setDraft(scenes, r);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const onPublish = () => {
        const version = new Date().toISOString();
        publish(draftScenes, version);
        saveContent(version, draftScenes);
    };

    return (
        <div className="space-y-2">
            <input type="file" accept="application/json" onChange={onFile} />
            {error && <div className="text-red-600 whitespace-pre-wrap">{error}</div>}
            {report && (
                <div className="text-sm">
                    <div>Errors: {report.errors.length}</div>
                    <div>Warnings: {report.warnings.length}</div>
                </div>
            )}
            {draftScenes.length > 0 && (
                <div>
                    <button
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                        disabled={!!report && report.errors.length > 0}
                        onClick={onPublish}
                    >
                        Publish
                    </button>
                </div>
            )}
        </div>
    );
}