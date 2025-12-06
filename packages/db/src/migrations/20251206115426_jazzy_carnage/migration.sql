CREATE TABLE `ideas` (
	`id` text,
	`title` text NOT NULL,
	`description` text,
	`link` text,
	`price` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text,
	`url` text NOT NULL,
	`idea_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
