CREATE TABLE `l2_episodic_memory` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`timestamp` text NOT NULL,
	`surface` text NOT NULL,
	`type` text NOT NULL,
	`summary` text NOT NULL,
	`entities` text NOT NULL,
	`salience` real NOT NULL,
	`provenance` text NOT NULL,
	`linked_episodes` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `l2_user_idx` ON `l2_episodic_memory` (`user_id`);--> statement-breakpoint
CREATE TABLE `l3_semantic_memory` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`node_type` text NOT NULL,
	`node_key` text NOT NULL,
	`node_value` text NOT NULL,
	`confidence` real NOT NULL,
	`last_verified` text NOT NULL,
	`source` text NOT NULL,
	`supersedes` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `l3_user_idx` ON `l3_semantic_memory` (`user_id`);--> statement-breakpoint
CREATE TABLE `l4_procedural_memory` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`skill_name` text NOT NULL,
	`trigger` text NOT NULL,
	`steps` text NOT NULL,
	`learned_from` text NOT NULL,
	`success_rate` real NOT NULL,
	`last_used` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `l4_user_idx` ON `l4_procedural_memory` (`user_id`);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `trust_scores` text DEFAULT '{}';