"use server";

import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveBlog(data: {
  title: string;
  slug: string;
  coverImage?: string;
  content: string;
  published: boolean;
  author?: string;
}) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  try {
    const existing = await db.select().from(blogs).where(eq(blogs.slug, data.slug)).limit(1);

    if (existing.length > 0) {
      // Update
      await db.update(blogs).set({
        ...data,
        updatedAt: new Date(),
      }).where(eq(blogs.slug, data.slug));
    } else {
      // Insert
      await db.insert(blogs).values({
        ...data,
        author: data.author || session.user.name || "Admin",
      });
    }

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Save Blog Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteBlog(id: number) {
  const session = await auth();
  if (!session || !session.user) throw new Error("Unauthorized");

  try {
    await db.delete(blogs).where(eq(blogs.id, id));
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
