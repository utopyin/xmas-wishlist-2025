PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ideas` (
	`id` text,
	`title` text NOT NULL,
	`description` text,
	`link` text,
	`is_picked` text,
	`image_url` text,
	`price` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ideas`(`id`, `title`, `description`, `link`, `is_picked`, `image_url`, `price`, `created_at`, `updated_at`) SELECT `id`, `title`, `description`, `link`, `is_picked`, `image_url`, `price`, `created_at`, `updated_at` FROM `ideas`;--> statement-breakpoint
DROP TABLE `ideas`;--> statement-breakpoint
ALTER TABLE `__new_ideas` RENAME TO `ideas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;