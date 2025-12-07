import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@wishlist/db";

const listIdeasServerFn = createServerFn().handler(() =>
    db.query.ideas.findMany()
);

export const listIdeasQueryOptions = queryOptions({
    queryKey: ["ideas"],
    queryFn: () => listIdeasServerFn(),
});

export type IdeasList = Awaited<ReturnType<typeof listIdeasServerFn>>;
export type Idea = IdeasList[number];
