CREATE TABLE "articles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"url" text NOT NULL,
	"image_url" text,
	"source" varchar(255),
	"category" varchar(50),
	"published_at" timestamp NOT NULL,
	"author" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "guest_post_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"package_name" varchar(50) NOT NULL,
	"website_url" varchar(255) NOT NULL,
	"target_keyword" varchar(255) NOT NULL,
	"payment_status" varchar(50) DEFAULT 'Unpaid',
	"order_status" varchar(50) DEFAULT 'Pending',
	"start_date" timestamp,
	"expire_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"project_type" varchar(100),
	"budget" varchar(50),
	"message" text,
	"source" varchar(50) DEFAULT 'website',
	"status" varchar(50) DEFAULT 'new',
	"created_at" timestamp DEFAULT now()
);
