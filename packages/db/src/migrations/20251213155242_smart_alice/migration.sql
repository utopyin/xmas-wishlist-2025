PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ideas` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`description` text,
	`link` text,
	`index` integer DEFAULT 0 NOT NULL,
	`picked_by` text,
	`image_url` text,
	`price` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ideas`(`id`, `title`, `description`, `link`, `index`, `picked_by`, `image_url`, `price`, `created_at`, `updated_at`) SELECT `id`, `title`, `description`, `link`, `index`, `picked_by`, `image_url`, `price`, `created_at`, `updated_at` FROM `ideas`;--> statement-breakpoint
DROP TABLE `ideas`;--> statement-breakpoint
ALTER TABLE `__new_ideas` RENAME TO `ideas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;