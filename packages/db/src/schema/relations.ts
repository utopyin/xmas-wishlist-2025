import { defineRelations } from "drizzle-orm";
import * as schema from "./";

export const relations = defineRelations(schema, (r) => ({
    ideas: {
        images: r.many.images({
            from: r.ideas.id,
            to: r.images.ideaId,
        }),
    },
    images: {
        idea: r.one.ideas({
            from: r.images.ideaId,
            to: r.ideas.id,
        }),
    },
}));
