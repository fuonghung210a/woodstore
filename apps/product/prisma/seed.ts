import { PrismaClient, WoodSpecies } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

type SeedPostStatus = "DRAFT" | "PUBLISHED";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Seed categories
  const categoriesPath = path.join(__dirname, "seed-data", "categories.json");
  const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // 2. Seed products
  const productsPath = path.join(__dirname, "seed-data", "products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        woodSpecies: prod.woodSpecies as WoodSpecies,
        categoryId: prod.categoryId,
        weightKg: prod.weightKg,
        craftsmanship: prod.craftsmanship,
        artisan: prod.artisan,
        finishType: prod.finishType,
        stockQuantity: prod.stockQuantity,
        isOneOfAKind: prod.isOneOfAKind,
        images: prod.images,
        tags: prod.tags,
        isFeatured: prod.isFeatured,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        woodSpecies: prod.woodSpecies as WoodSpecies,
        categoryId: prod.categoryId,
        weightKg: prod.weightKg,
        craftsmanship: prod.craftsmanship,
        artisan: prod.artisan,
        finishType: prod.finishType,
        sku: prod.sku,
        stockQuantity: prod.stockQuantity,
        isOneOfAKind: prod.isOneOfAKind,
        images: prod.images,
        tags: prod.tags,
        isFeatured: prod.isFeatured,
      },
    });
    console.log(`  ✓ Product: ${prod.name}`);
  }

  // 3. Seed posts
  const postsPath = path.join(__dirname, "seed-data", "posts.json");
  const posts = JSON.parse(fs.readFileSync(postsPath, "utf-8"));

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        tags: post.tags,
        status: post.status as SeedPostStatus,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        author: post.author,
        relatedProductIds: post.relatedProductIds,
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        tags: post.tags,
        status: post.status as SeedPostStatus,
        publishedAt: post.status === "PUBLISHED" ? new Date() : null,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        author: post.author,
        relatedProductIds: post.relatedProductIds,
      },
    });
    console.log(`  ✓ Post: ${post.title}`);
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
