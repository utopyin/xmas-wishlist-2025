import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@wishlist/db";
import { z } from "zod";

const listIdeasServerFn = createServerFn()
    .inputValidator(z.object({ deviceId: z.string().optional() }))
    .handler(async ({ data: { deviceId } }) => {
        const ideas = await db.query.ideas.findMany();

        return ideas
            .sort((a, b) => a.index - b.index)
            .map((idea) => {
                const pickedBy =
                    idea.pickedBy === deviceId ? PickedBy.me : PickedBy.someone;
                return {
                    ...idea,
                    pickedBy: idea.pickedBy ? pickedBy : null,
                };
            });
    });

export const getListIdeasQueryOptions = (deviceId?: string) =>
    queryOptions({
        queryKey: ["ideas", deviceId],
        queryFn: () => listIdeasServerFn({ data: { deviceId } }),
    });

export type IdeasList = Awaited<ReturnType<typeof listIdeasServerFn>>;
export type Idea = IdeasList[number];

export const PickedBy = {
    me: "me" as const,
    someone: "someone" as const,
} as const;

export type PickedBy = (typeof PickedBy)[keyof typeof PickedBy];
