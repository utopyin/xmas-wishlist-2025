import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@wishlist/db";

const listIdeasServerFn = createServerFn().handler(() =>
    db.query.ideas.findMany({ with: { images: true } })
);

export const listIdeasQueryOptions = queryOptions({
    queryKey: ["ideas"],
    queryFn: () => listIdeasServerFn(),
});
