import { nanoid } from "@wishlist/common";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ideas = sqliteTable("ideas", {
    id: text("id").primaryKey().$defaultFn(nanoid),
    title: text("title").notNull(),
    description: text("description"),
    link: text("link"),
    pickedBy: text("picked_by"),
    imageUrl: text("image_url"),
    price: integer("price", { mode: "number" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export type Idea = typeof ideas.$inferSelect;
