import { nanoid } from "@wishlist/common";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const images = sqliteTable("images", {
    id: text("id").$defaultFn(() => nanoid()),
    url: text("url").notNull(),
    ideaId: text("idea_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});
