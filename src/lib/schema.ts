import { z } from 'zod';

export const choiceRequestSchema = z.object({
    text: z.string(),
    nextSceneId: z.string().optional(),
});

export const sceneSchema = z.object({
    sceneId: z.string(),
    speaker: z.string(),
    backgroundImage: z.string().optional(),
    text: z.string(),
    start: z.boolean(),
    end: z.boolean(),
    choiceRequests: z.array(choiceRequestSchema),
});

export type ChoiceRequest = z.infer<typeof choiceRequestSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export const sceneArraySchema = z.array(sceneSchema);