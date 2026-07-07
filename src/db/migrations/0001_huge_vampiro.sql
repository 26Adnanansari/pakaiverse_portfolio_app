CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"cover_image" text,
	"content" text,
	"published" boolean DEFAULT false,
	"author" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "email_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"scheduled_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"attempts" integer DEFAULT 0,
	"error_log" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "funnels" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"step_completed" varchar(50) DEFAULT 'opt_in',
	"source" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"live_url" text,
	"github_url" text,
	"tech_stack" text,
	"category" varchar(100),
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"message_id" varchar(255),
	"content" text,
	"sentiment" varchar(50),
	"ai_suggested_response" text,
	"status" varchar(50) DEFAULT 'pending',
	"received_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "guest_post_orders" ADD COLUMN "user_email" varchar(255);--> statement-breakpoint
ALTER TABLE "guest_post_orders" ADD COLUMN "payment_proof_url" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "suppress_list" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "follow_up_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "last_emailed_at" timestamp;