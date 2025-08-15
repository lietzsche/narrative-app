import type { Scene } from './schema';

export interface ValidationReport {
    errors: string[];
    warnings: string[];
}

export function validateGraph(scenes: Scene[]): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    const idMap = new Map<string, Scene>();
    for (const scene of scenes) {
        if (idMap.has(scene.sceneId)) {
            errors.push(`Duplicate sceneId ${scene.sceneId}`);
        } else {
            idMap.set(scene.sceneId, scene);
        }
    }

    const startScenes = scenes.filter((s) => s.start);
    if (startScenes.length !== 1) {
        errors.push(`Expected exactly one start scene, found ${startScenes.length}`);
    }

    for (const scene of scenes) {
        if (scene.end && scene.choiceRequests.length > 0) {
            warnings.push(`End scene ${scene.sceneId} has choices`);
        }
        for (const choice of scene.choiceRequests) {
            if (!scene.end && !choice.nextSceneId) {
                errors.push(`Scene ${scene.sceneId} choice missing nextSceneId`);
            }
            if (choice.nextSceneId && !idMap.has(choice.nextSceneId)) {
                errors.push(`Scene ${scene.sceneId} choice points to missing scene ${choice.nextSceneId}`);
            }
        }
    }

    const visited = new Set<string>();
    const visiting = new Set<string>();
    const startId = startScenes[0]?.sceneId;

    function dfs(id: string) {
        if (visiting.has(id)) {
            errors.push(`Cycle detected at ${id}`);
            return;
        }
        if (visited.has(id)) return;
        visiting.add(id);
        const s = idMap.get(id);
        if (s) {
            for (const c of s.choiceRequests) {
                if (c.nextSceneId) dfs(c.nextSceneId);
            }
        }
        visiting.delete(id);
        visited.add(id);
    }

    if (startId) dfs(startId);

    for (const scene of scenes) {
        if (!visited.has(scene.sceneId)) {
            warnings.push(`Scene ${scene.sceneId} is unreachable`);
        }
    }

    return { errors, warnings };
}