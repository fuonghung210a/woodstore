# Database Foundation & Product Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `@woodshop/database` shared package and the Product service domain + infrastructure layer with Clean Architecture, Prisma ORM, and repository pattern.

**Architecture:** Service owns Prisma schema (`apps/product/prisma/`), shared package owns Prisma infrastructure (`packages/database/`). Domain interfaces in `domain/repositories/`, implementations in `infrastructure/database/repositories/`. Token-based DI for testability.

**Tech Stack:** NestJS 10, Prisma 5, PostgreSQL, TypeScript 5.3, pnpm workspace

---

## File Structure Overview

```
packages/database/
├── package.json                          ← NEW
├── tsconfig.json                         ← NEW
└── src/
    ├── index.ts                          ← NEW — public API exports
    ├── types.ts                          ← NEW — DbConfig, TransactionClient
    ├── prisma.service.ts                 ← NEW — PrismaClient wrapper
    └── database.module.ts                ← NEW — DynamicModule

apps/product/
├── package.json                          ← MODIFY — add deps
├── tsconfig.json                         ← NEW — fill in
├── .env                                  ← NEW
├── prisma/
│   └── schema.prisma                     ← NEW — Product, Category, WoodSpecies enum
└── src/
    ├── main.ts                           ← MODIFY — bootstrap
    ├── app.module.ts                     ← MODIFY — wire modules
    ├── domain/
    │   ├── value-objects/
    │   │   ├── dimensions.vo.ts          ← NEW
    │   │   │   └── dimensions.vo.test.ts ← NEW
    │   │   └── price.vo.ts               ← NEW
    │   │       └── price.vo.test.ts      ← NEW
    │   ├── entities/
    │   │   ├── product.entity.ts         ← NEW
    │   │   │   └── product.entity.test.ts← NEW
    │   │   └── category.entity.ts        ← NEW
    │   ├── repositories/
    │   │   ├── product-repository.interface.ts ← NEW
    │   │   └── category-repository.interface.ts← NEW
    │   └── exceptions/
    │       ├── domain-error.base.ts      ← NEW
    │       └── product-not-found.exception.ts  ← NEW
    └── infrastructure/
        ├── config/
        │   └── env.validation.ts         ← NEW
        ├── database/
        │   └── repositories/
        │       ├── product.repository.impl.ts    ← NEW
        │       └── category.repository.impl.ts   ← NEW
        └── database.module.ts            ← NEW
```

---

## Task 1: Setup `@woodshop/database` Package

**Files:**
- Create: `packages/database/package.json`
- Create: `packages/database/tsconfig.json`
- Create: `packages/database/src/index.ts`
- Create: `packages/database/src/types.ts`
- Create: `packages/database/src/prisma.service.ts`
- Create: `packages/database/src/database.module.ts`

- [ ] **Step 1: Create `packages/database/package.json`**

```json
{
  "name": "@woodshop/database",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0"
  },
  "peerDependencies": {
    "prisma": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create `packages/database/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `packages/database/src/types.ts`**

```typescript
import { PrismaClient } from '@prisma/client';

export interface DbConfig {
  url: string;
  logLevel?: 'error' | 'warn' | 'info' | 'query';
  enableTransactions?: boolean;
}

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

export type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>;
```

- [ ] **Step 4: Create `packages/database/src/prisma.service.ts`**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TransactionCallback, TransactionClient } from './types';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    return this.$transaction(
      async (tx) => callback(tx as unknown as TransactionClient),
    );
  }
}
```

- [ ] **Step 5: Create `packages/database/src/database.module.ts`**

```typescript
import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DbConfig } from './types';

@Module({})
export class DatabaseModule {
  static forRoot(config: DbConfig): DynamicModule {
    const prismaProvider = {
      provide: PrismaService,
      useFactory: () =>
        new PrismaService({
          datasources: { db: { url: config.url } },
          log: config.logLevel ? [config.logLevel] : ['error'],
        }),
    };

    return {
      module: DatabaseModule,
      providers: [prismaProvider],
      exports: [PrismaService],
      global: true,
    };
  }
}
```

- [ ] **Step 6: Create `packages/database/src/index.ts`**

```typescript
export { DatabaseModule } from './database.module';
export { PrismaService } from './prisma.service';
export type { DbConfig, TransactionClient, TransactionCallback } from './types';
```

- [ ] **Step 7: Install dependencies**

```bash
cd /home/fhung210/learning/woodshop && pnpm install
```

Expected: All workspace packages resolve, `@prisma/client` installed in `packages/database/node_modules`.

- [ ] **Step 8: Commit**

```bash
git add packages/database/
git commit -m "feat: create @woodshop/database package with PrismaService and DynamicModule"
```

---

## Task 2: Setup `apps/product` Dependencies & Config

**Files:**
- Modify: `apps/product/package.json`
- Create: `apps/product/tsconfig.json`
- Create: `apps/product/.env`
- Modify: `apps/product/src/main.ts`

- [ ] **Step 1: Write `apps/product/package.json`**

```json
{
  "name": "@woodshop/product",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@woodshop/database": "workspace:*",
    "@prisma/client": "^5.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

- [ ] **Step 2: Create `apps/product/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@woodshop/database": ["../../packages/database/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/product/.env`**

```env
DATABASE_URL="postgresql://woodshop:woodshop@localhost:5432/woodshop_product?schema=public"
NODE_ENV=development
PORT=3001
```

- [ ] **Step 4: Create `apps/product/.env.example`**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/woodshop_product?schema=public"
NODE_ENV=development
PORT=3001
```

- [ ] **Step 5: Update `apps/product/src/main.ts`**

```typescript
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`Product service running on port ${port}`);
}

bootstrap();
```

- [ ] **Step 6: Install dependencies**

```bash
cd /home/fhung210/learning/woodshop && pnpm install
```

- [ ] **Step 7: Commit**

```bash
git add apps/product/package.json apps/product/tsconfig.json apps/product/.env apps/product/.env.example apps/product/src/main.ts
git commit -m "feat: setup product service dependencies, config, and bootstrap"
```

---

## Task 3: Prisma Schema & Generate

**Files:**
- Create: `apps/product/prisma/schema.prisma`

- [ ] **Step 1: Create `apps/product/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Loại gỗ — enum cố định, không cần table riêng
enum WoodSpecies {
  HUONG       // Gỗ hương
  TRAC        // Gỗ trắc
  MUN         // Gỗ mun
  GO_DO       // Gỗ gõ đỏ
  CAM_LAI     // Gỗ cẩm lai
  SON_TA      // Gỗ sơn ta
  THONG       // Gỗ thông
  SUAN        // Gỗ xoan
  KHAC        // Loại khác
}

model Category {
  id          String     @id @default(uuid())
  name        String     @unique
  slug        String     @unique
  description String?
  parentId    String?    @db.Uuid
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([isActive])
  @@index([parentId])
  @@index([sortOrder])
}

model Product {
  id            String      @id @default(uuid())
  name          String
  slug          String      @unique
  description   String?
  price         Decimal     @db.Decimal(10, 2)
  currency      String      @default("VND")

  // Wood info (enum, not FK)
  woodSpecies   WoodSpecies

  // Category (optional FK)
  categoryId    String?     @db.Uuid
  category      Category?   @relation(fields: [categoryId], references: [id])

  // Dimensions (cm)
  lengthCm      Decimal?    @db.Decimal(8, 2)
  widthCm       Decimal?    @db.Decimal(8, 2)
  heightCm      Decimal?    @db.Decimal(8, 2)
  weightKg      Decimal?    @db.Decimal(8, 2)

  // Craft details
  craftsmanship String?
  artisan       String?
  finishType    String?

  // Inventory
  sku           String?     @unique
  stockQuantity Int         @default(0)
  isOneOfAKind  Boolean     @default(false)

  // Media & tags
  images        String[]
  tags          String[]

  // Status
  isActive      Boolean     @default(true)
  isFeatured    Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?

  @@index([isActive, deletedAt])
  @@index([categoryId, isActive])
  @@index([woodSpecies, isActive])
  @@index([slug, isActive])
  @@index([isFeatured, isActive])
  @@index([price])
}
```

- [ ] **Step 2: Run Prisma generate**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm prisma generate
```

Expected: `✔ Generated Prisma Client (5.x.x) to ./node_modules/.pnpm/@prisma+client@...`

- [ ] **Step 3: Commit**

```bash
git add apps/product/prisma/
git commit -m "feat: add Prisma schema with Product, Category, WoodSpecies enum"
```

---

## Task 4: Domain Layer — Value Objects (TDD)

**Files:**
- Create: `apps/product/src/domain/value-objects/dimensions.vo.ts`
- Create: `apps/product/src/domain/value-objects/dimensions.vo.test.ts`
- Create: `apps/product/src/domain/value-objects/price.vo.ts`
- Create: `apps/product/src/domain/value-objects/price.vo.test.ts`

- [ ] **Step 1: Write failing test for `Dimensions`**

Create `apps/product/src/domain/value-objects/dimensions.vo.test.ts`:

```typescript
import { Dimensions } from './dimensions.vo';

describe('Dimensions', () => {
  it('should create valid dimensions', () => {
    const d = new Dimensions(30, 20, 15);
    expect(d.lengthCm).toBe(30);
    expect(d.widthCm).toBe(20);
    expect(d.heightCm).toBe(15);
  });

  it('should calculate volume correctly', () => {
    const d = new Dimensions(10, 5, 2);
    expect(d.volumeCm3).toBe(100);
  });

  it('should throw for negative length', () => {
    expect(() => new Dimensions(-1, 10, 10)).toThrow(
      'Dimensions must be non-negative',
    );
  });

  it('should throw for negative width', () => {
    expect(() => new Dimensions(10, -1, 10)).toThrow(
      'Dimensions must be non-negative',
    );
  });

  it('should throw for negative height', () => {
    expect(() => new Dimensions(10, 10, -1)).toThrow(
      'Dimensions must be non-negative',
    );
  });

  it('should allow zero dimensions', () => {
    const d = new Dimensions(0, 0, 0);
    expect(d.volumeCm3).toBe(0);
  });

  it('should equal another dimensions with same values', () => {
    const a = new Dimensions(10, 20, 30);
    const b = new Dimensions(10, 20, 30);
    expect(a.equals(b)).toBe(true);
  });

  it('should not equal another dimensions with different values', () => {
    const a = new Dimensions(10, 20, 30);
    const b = new Dimensions(10, 20, 31);
    expect(a.equals(b)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test -- dimensions.vo.test.ts
```

Expected: FAIL — `Cannot find module './dimensions.vo'`

- [ ] **Step 3: Implement `Dimensions` value object**

Create `apps/product/src/domain/value-objects/dimensions.vo.ts`:

```typescript
export class Dimensions {
  constructor(
    readonly lengthCm: number,
    readonly widthCm: number,
    readonly heightCm: number,
  ) {
    if (lengthCm < 0 || widthCm < 0 || heightCm < 0) {
      throw new Error('Dimensions must be non-negative');
    }
  }

  get volumeCm3(): number {
    return this.lengthCm * this.widthCm * this.heightCm;
  }

  equals(other: Dimensions): boolean {
    return (
      this.lengthCm === other.lengthCm &&
      this.widthCm === other.widthCm &&
      this.heightCm === other.heightCm
    );
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test -- dimensions.vo.test.ts
```

Expected: PASS — all 8 tests

- [ ] **Step 5: Write failing test for `Price`**

Create `apps/product/src/domain/value-objects/price.vo.test.ts`:

```typescript
import { Price } from './price.vo';

describe('Price', () => {
  it('should create valid price with default VND', () => {
    const p = new Price(100000);
    expect(p.amount).toBe(100000);
    expect(p.currency).toBe('VND');
  });

  it('should create valid price with custom currency', () => {
    const p = new Price(50, 'USD');
    expect(p.amount).toBe(50);
    expect(p.currency).toBe('USD');
  });

  it('should throw for negative price', () => {
    expect(() => new Price(-1)).toThrow('Price cannot be negative');
  });

  it('should allow zero price', () => {
    const p = new Price(0);
    expect(p.amount).toBe(0);
  });

  it('should equal another price with same amount and currency', () => {
    const a = new Price(100, 'VND');
    const b = new Price(100, 'VND');
    expect(a.equals(b)).toBe(true);
  });

  it('should not equal another price with different amount', () => {
    const a = new Price(100, 'VND');
    const b = new Price(200, 'VND');
    expect(a.equals(b)).toBe(false);
  });

  it('should not equal another price with different currency', () => {
    const a = new Price(100, 'VND');
    const b = new Price(100, 'USD');
    expect(a.equals(b)).toBe(false);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test -- price.vo.test.ts
```

Expected: FAIL — `Cannot find module './price.vo'`

- [ ] **Step 7: Implement `Price` value object**

Create `apps/product/src/domain/value-objects/price.vo.ts`:

```typescript
export class Price {
  constructor(
    readonly amount: number,
    readonly currency: string = 'VND',
  ) {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
  }

  equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test -- price.vo.test.ts
```

Expected: PASS — all 7 tests

- [ ] **Step 9: Commit**

```bash
git add apps/product/src/domain/value-objects/
git commit -m "feat: add Dimensions and Price value objects with tests"
```

---

## Task 5: Domain Layer — Entities (TDD)

**Files:**
- Create: `apps/product/src/domain/entities/product.entity.ts`
- Create: `apps/product/src/domain/entities/product.entity.test.ts`
- Create: `apps/product/src/domain/entities/category.entity.ts`

- [ ] **Step 1: Write failing test for `ProductEntity`**

Create `apps/product/src/domain/entities/product.entity.test.ts`:

```typescript
import { ProductEntity } from './product.entity';
import { Price } from '../value-objects/price.vo';
import { Dimensions } from '../value-objects/dimensions.vo';
import { WoodSpecies } from '@prisma/client';

function makeProduct(overrides: Partial<ConstructorParameters<typeof ProductEntity>[0]> = {}): ProductEntity {
  const defaults: ConstructorParameters<typeof ProductEntity>[0] = {
    id: 'test-id',
    name: 'Test Product',
    slug: 'test-product',
    price: new Price(100000),
    woodSpecies: WoodSpecies.HUONG,
    dimensions: null,
    weightKg: null,
    craftsmanship: null,
    artisan: null,
    finishType: null,
    sku: null,
    stockQuantity: 5,
    isOneOfAKind: false,
    images: [],
    tags: [],
    categoryId: null,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  return new ProductEntity({ ...defaults, ...overrides });
}

describe('ProductEntity', () => {
  describe('isAvailable', () => {
    it('should be available when active, not deleted, and in stock', () => {
      const p = makeProduct({ isActive: true, deletedAt: null, stockQuantity: 5 });
      expect(p.isAvailable).toBe(true);
    });

    it('should not be available when inactive', () => {
      const p = makeProduct({ isActive: false });
      expect(p.isAvailable).toBe(false);
    });

    it('should not be available when soft deleted', () => {
      const p = makeProduct({ deletedAt: new Date() });
      expect(p.isAvailable).toBe(false);
    });

    it('should not be available when out of stock (non-unique)', () => {
      const p = makeProduct({ stockQuantity: 0, isOneOfAKind: false });
      expect(p.isAvailable).toBe(false);
    });

    it('should be available when one-of-a-kind even with zero stock', () => {
      const p = makeProduct({ stockQuantity: 0, isOneOfAKind: true });
      expect(p.isAvailable).toBe(true);
    });
  });

  describe('canFulfill', () => {
    it('should fulfill quantity when available and in stock', () => {
      const p = makeProduct({ stockQuantity: 5 });
      expect(p.canFulfill(3)).toBe(true);
    });

    it('should not fulfill when quantity exceeds stock', () => {
      const p = makeProduct({ stockQuantity: 2 });
      expect(p.canFulfill(5)).toBe(false);
    });

    it('should fulfill exactly 1 for one-of-a-kind', () => {
      const p = makeProduct({ isOneOfAKind: true });
      expect(p.canFulfill(1)).toBe(true);
    });

    it('should not fulfill more than 1 for one-of-a-kind', () => {
      const p = makeProduct({ isOneOfAKind: true });
      expect(p.canFulfill(2)).toBe(false);
    });

    it('should not fulfill when not available', () => {
      const p = makeProduct({ isActive: false });
      expect(p.canFulfill(1)).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test -- product.entity.test.ts
```

Expected: FAIL — `Cannot find module './product.entity'`

- [ ] **Step 3: Implement `ProductEntity`**

Create `apps/product/src/domain/entities/product.entity.ts`:

```typescript
import { Price } from '../value-objects/price.vo';
import { Dimensions } from '../value-objects/dimensions.vo';
import { WoodSpecies } from '@prisma/client';

export interface ProductEntityProps {
  id: string;
  name: string;
  slug: string;
  price: Price;
  woodSpecies: WoodSpecies;
  dimensions: Dimensions | null;
  weightKg: number | null;
  craftsmanship: string | null;
  artisan: string | null;
  finishType: string | null;
  sku: string | null;
  stockQuantity: number;
  isOneOfAKind: boolean;
  images: string[];
  tags: string[];
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ProductEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly price: Price;
  readonly woodSpecies: WoodSpecies;
  readonly dimensions: Dimensions | null;
  readonly weightKg: number | null;
  readonly craftsmanship: string | null;
  readonly artisan: string | null;
  readonly finishType: string | null;
  readonly sku: string | null;
  readonly stockQuantity: number;
  readonly isOneOfAKind: boolean;
  readonly images: string[];
  readonly tags: string[];
  readonly categoryId: string | null;
  readonly isActive: boolean;
  readonly isFeatured: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: ProductEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.price = props.price;
    this.woodSpecies = props.woodSpecies;
    this.dimensions = props.dimensions;
    this.weightKg = props.weightKg;
    this.craftsmanship = props.craftsmanship;
    this.artisan = props.artisan;
    this.finishType = props.finishType;
    this.sku = props.sku;
    this.stockQuantity = props.stockQuantity;
    this.isOneOfAKind = props.isOneOfAKind;
    this.images = props.images;
    this.tags = props.tags;
    this.categoryId = props.categoryId;
    this.isActive = props.isActive;
    this.isFeatured = props.isFeatured;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  get isAvailable(): boolean {
    return (
      this.isActive &&
      this.deletedAt === null &&
      (this.isOneOfAKind || this.stockQuantity > 0)
    );
  }

  canFulfill(quantity: number): boolean {
    if (!this.isAvailable) return false;
    if (this.isOneOfAKind) return quantity === 1;
    return this.stockQuantity >= quantity;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test -- product.entity.test.ts
```

Expected: PASS — all 10 tests

- [ ] **Step 5: Create `CategoryEntity`**

Create `apps/product/src/domain/entities/category.entity.ts`:

```typescript
export interface CategoryEntityProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly parentId: string | null;
  readonly sortOrder: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: CategoryEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description;
    this.parentId = props.parentId;
    this.sortOrder = props.sortOrder;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/product/src/domain/entities/
git commit -m "feat: add ProductEntity and CategoryEntity with tests"
```

---

## Task 6: Domain Layer — Exceptions & Repository Interfaces

**Files:**
- Create: `apps/product/src/domain/exceptions/domain-error.base.ts`
- Create: `apps/product/src/domain/exceptions/product-not-found.exception.ts`
- Create: `apps/product/src/domain/repositories/product-repository.interface.ts`
- Create: `apps/product/src/domain/repositories/category-repository.interface.ts`
- Create: `apps/product/src/domain/types.ts` (shared domain types: ProductFilter, PaginationParams, etc.)

- [ ] **Step 1: Create `DomainError` base class**

Create `apps/product/src/domain/exceptions/domain-error.base.ts`:

```typescript
export abstract class DomainError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
```

- [ ] **Step 2: Create `ProductNotFoundException`**

Create `apps/product/src/domain/exceptions/product-not-found.exception.ts`:

```typescript
import { DomainError } from './domain-error.base';

export class ProductNotFoundException extends DomainError {
  constructor(id: string) {
    super(`Product not found: ${id}`, 'PRODUCT_NOT_FOUND');
  }
}
```

- [ ] **Step 3: Create shared domain types**

Create `apps/product/src/domain/types.ts`:

```typescript
import { Dimensions } from './value-objects/dimensions.vo';
import { Price } from './value-objects/price.vo';
import { WoodSpecies } from '@prisma/client';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilter {
  categoryId?: string;
  woodSpecies?: WoodSpecies;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minDimensions?: Dimensions;
  maxDimensions?: Dimensions;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  price: Price;
  woodSpecies: WoodSpecies;
  categoryId?: string;
  dimensions?: Dimensions;
  weightKg?: number;
  craftsmanship?: string;
  artisan?: string;
  finishType?: string;
  sku?: string;
  stockQuantity?: number;
  isOneOfAKind?: boolean;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}
```

- [ ] **Step 4: Create `IProductRepository` interface**

Create `apps/product/src/domain/repositories/product-repository.interface.ts`:

```typescript
import { ProductEntity } from '../entities/product.entity';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../types';
import { WoodSpecies } from '@prisma/client';

export const IProductRepository = 'IProductRepository';

export interface IProductRepositoryType {
  findById(id: string): Promise<ProductEntity | null>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findAll(
    filter: ProductFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductEntity>>;
  findFeatured(limit: number): Promise<ProductEntity[]>;
  create(data: CreateProductInput): Promise<ProductEntity>;
  update(id: string, data: UpdateProductInput): Promise<ProductEntity>;
  softDelete(id: string): Promise<void>;
  findByCategory(
    categoryId: string,
    filter: ProductFilter,
  ): Promise<ProductEntity[]>;
  findByWoodSpecies(species: WoodSpecies): Promise<ProductEntity[]>;
}
```

- [ ] **Step 5: Create `ICategoryRepository` interface**

Create `apps/product/src/domain/repositories/category-repository.interface.ts`:

```typescript
import { CategoryEntity } from '../entities/category.entity';

export const ICategoryRepository = 'ICategoryRepository';

export interface ICategoryRepositoryType {
  findById(id: string): Promise<CategoryEntity | null>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  findAll(): Promise<CategoryEntity[]>;
  findActive(): Promise<CategoryEntity[]>;
  create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
  }): Promise<CategoryEntity>;
  update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ): Promise<CategoryEntity>;
  findChildren(parentId: string): Promise<CategoryEntity[]>;
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/product/src/domain/exceptions/ apps/product/src/domain/types.ts apps/product/src/domain/repositories/
git commit -m "feat: add domain exceptions, shared types, and repository interfaces"
```

---

## Task 7: Infrastructure Layer — Repository Implementations

**Files:**
- Create: `apps/product/src/infrastructure/database/repositories/product.repository.impl.ts`
- Create: `apps/product/src/infrastructure/database/repositories/category.repository.impl.ts`
- Create: `apps/product/src/infrastructure/database.module.ts`
- Create: `apps/product/src/infrastructure/config/env.validation.ts`

- [ ] **Step 1: Create `PrismaProductRepository`**

Create `apps/product/src/infrastructure/database/repositories/product.repository.impl.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@woodshop/database';
import {
  IProductRepositoryType,
  IProductRepository,
} from '../../../domain/repositories/product-repository.interface';
import { ProductEntity, ProductEntityProps } from '../../../domain/entities/product.entity';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../../../domain/types';
import { WoodSpecies } from '@prisma/client';
import { Price } from '../../../domain/value-objects/price.vo';
import { Dimensions } from '../../../domain/value-objects/dimensions.vo';

@Injectable()
export class PrismaProductRepository implements IProductRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { slug, isActive: true, deletedAt: null },
      include: { category: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAll(
    filter: ProductFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductEntity>> {
    const where = this.buildWhere(filter);
    const skip = (pagination.page - 1) * pagination.limit;

    const [records, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: records.map((r) => this.toEntity(r)),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findFeatured(limit: number): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true, deletedAt: null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(data: CreateProductInput): Promise<ProductEntity> {
    const record = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price.amount,
        currency: data.price.currency,
        woodSpecies: data.woodSpecies,
        categoryId: data.categoryId,
        lengthCm: data.dimensions?.lengthCm ?? null,
        widthCm: data.dimensions?.widthCm ?? null,
        heightCm: data.dimensions?.heightCm ?? null,
        weightKg: data.weightKg,
        craftsmanship: data.craftsmanship,
        artisan: data.artisan,
        finishType: data.finishType,
        sku: data.sku,
        stockQuantity: data.stockQuantity ?? 0,
        isOneOfAKind: data.isOneOfAKind ?? false,
        images: data.images ?? [],
        tags: data.tags ?? [],
        isFeatured: data.isFeatured ?? false,
      },
      include: { category: true },
    });
    return this.toEntity(record);
  }

  async update(id: string, data: UpdateProductInput): Promise<ProductEntity> {
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.slug) updateData.slug = data.slug;
    if (data.price) {
      updateData.price = data.price.amount;
      updateData.currency = data.price.currency;
    }
    if (data.woodSpecies) updateData.woodSpecies = data.woodSpecies;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.dimensions) {
      updateData.lengthCm = data.dimensions.lengthCm;
      updateData.widthCm = data.dimensions.widthCm;
      updateData.heightCm = data.dimensions.heightCm;
    }
    if (data.weightKg !== undefined) updateData.weightKg = data.weightKg;
    if (data.craftsmanship !== undefined) updateData.craftsmanship = data.craftsmanship;
    if (data.artisan !== undefined) updateData.artisan = data.artisan;
    if (data.finishType !== undefined) updateData.finishType = data.finishType;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;
    if (data.isOneOfAKind !== undefined) updateData.isOneOfAKind = data.isOneOfAKind;
    if (data.images) updateData.images = data.images;
    if (data.tags) updateData.tags = data.tags;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const record = await this.prisma.product.update({
      where: { id, deletedAt: null },
      data: updateData,
      include: { category: true },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async findByCategory(
    categoryId: string,
    filter: ProductFilter,
  ): Promise<ProductEntity[]> {
    const where = this.buildWhere({ ...filter, categoryId });
    const records = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findByWoodSpecies(species: WoodSpecies): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      where: { woodSpecies: species, isActive: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return records.map((r) => this.toEntity(r));
  }

  private buildWhere(filter: ProductFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {
      isActive: filter.isActive ?? true,
      deletedAt: null,
    };
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.woodSpecies) where.woodSpecies = filter.woodSpecies;
    if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) where.price.gte = filter.minPrice;
      if (filter.maxPrice !== undefined) where.price.lte = filter.maxPrice;
    }
    return where;
  }

  private toEntity(record: any): ProductEntity {
    const props: ProductEntityProps = {
      id: record.id,
      name: record.name,
      slug: record.slug,
      price: new Price(Number(record.price), record.currency),
      woodSpecies: record.woodSpecies as WoodSpecies,
      dimensions:
        record.lengthCm != null
          ? new Dimensions(
              Number(record.lengthCm),
              Number(record.widthCm),
              Number(record.heightCm),
            )
          : null,
      weightKg: record.weightKg != null ? Number(record.weightKg) : null,
      craftsmanship: record.craftsmanship,
      artisan: record.artisan,
      finishType: record.finishType,
      sku: record.sku,
      stockQuantity: record.stockQuantity,
      isOneOfAKind: record.isOneOfAKind,
      images: record.images as string[],
      tags: record.tags as string[],
      categoryId: record.categoryId,
      isActive: record.isActive,
      isFeatured: record.isFeatured,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    };
    return new ProductEntity(props);
  }
}
```

- [ ] **Step 2: Create `PrismaCategoryRepository`**

Create `apps/product/src/infrastructure/database/repositories/category.repository.impl.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@woodshop/database';
import {
  ICategoryRepositoryType,
  ICategoryRepository,
} from '../../../domain/repositories/category-repository.interface';
import {
  CategoryEntity,
  CategoryEntityProps,
} from '../../../domain/entities/category.entity';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepositoryType {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CategoryEntity | null> {
    const record = await this.prisma.category.findUnique({
      where: { id, isActive: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const record = await this.prisma.category.findUnique({
      where: { slug, isActive: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAll(): Promise<CategoryEntity[]> {
    const records = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toEntity(r));
  }

  async findActive(): Promise<CategoryEntity[]> {
    const records = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toEntity(r));
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
  }): Promise<CategoryEntity> {
    const record = await this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
        sortOrder: data.sortOrder ?? 0,
      },
    });
    return this.toEntity(record);
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ): Promise<CategoryEntity> {
    const record = await this.prisma.category.update({
      where: { id },
      data,
    });
    return this.toEntity(record);
  }

  async findChildren(parentId: string): Promise<CategoryEntity[]> {
    const records = await this.prisma.category.findMany({
      where: { parentId, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return records.map((r) => this.toEntity(r));
  }

  private toEntity(record: any): CategoryEntity {
    const props: CategoryEntityProps = {
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      parentId: record.parentId,
      sortOrder: record.sortOrder,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    return new CategoryEntity(props);
  }
}
```

- [ ] **Step 3: Create `env.validation.ts`**

Create `apps/product/src/infrastructure/config/env.validation.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables: ${result.error.errors.map((e) => e.message).join(', ')}`,
    );
  }
  return result.data;
}
```

Wait, we need zod installed. Let me add it to package.json first.

Actually, let me use a simpler approach without zod to avoid adding another dependency at this stage:

Create `apps/product/src/infrastructure/config/env.validation.ts`:

```typescript
export interface EnvConfig {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
}

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const errors: string[] = [];

  const databaseUrl = config.DATABASE_URL;
  if (!databaseUrl || typeof databaseUrl !== 'string') {
    errors.push('DATABASE_URL is required and must be a string');
  }

  const nodeEnv = config.NODE_ENV;
  if (
    nodeEnv &&
    !['development', 'test', 'production'].includes(nodeEnv as string)
  ) {
    errors.push('NODE_ENV must be development, test, or production');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid environment variables: ${errors.join(', ')}`);
  }

  return {
    DATABASE_URL: databaseUrl as string,
    NODE_ENV: (config.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: Number(config.PORT) || 3001,
  };
}
```

- [ ] **Step 4: Create `database.module.ts` (infrastructure)**

Create `apps/product/src/infrastructure/database.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@woodshop/database';
import { PrismaProductRepository } from './database/repositories/product.repository.impl';
import { PrismaCategoryRepository } from './database/repositories/category.repository.impl';
import { IProductRepository } from '../domain/repositories/product-repository.interface';
import { ICategoryRepository } from '../domain/repositories/category-repository.interface';

@Module({
  imports: [
    DatabaseModule.forRoot({
      url: process.env.DATABASE_URL!,
      logLevel: process.env.NODE_ENV === 'development' ? 'query' : 'error',
    }),
  ],
  providers: [
    PrismaProductRepository,
    PrismaCategoryRepository,
    { provide: IProductRepository, useClass: PrismaProductRepository },
    { provide: ICategoryRepository, useClass: PrismaCategoryRepository },
  ],
  exports: [IProductRepository, ICategoryRepository],
})
export class ProductInfrastructureModule {}
```

- [ ] **Step 5: Commit**

```bash
git add apps/product/src/infrastructure/
git commit -m "feat: add repository implementations, env validation, and infrastructure module"
```

---

## Task 8: Wire Everything Together & Verify

**Files:**
- Modify: `apps/product/src/app.module.ts`

- [ ] **Step 1: Update `app.module.ts`**

Modify `apps/product/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './infrastructure/config/env.validation';
import { ProductInfrastructureModule } from './infrastructure/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ProductInfrastructureModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 2: Run TypeScript compilation check**

```bash
cd /home/fhung210/learning/woodshop/apps/product && npx tsc --noEmit
```

Expected: No errors. If there are errors, fix them before proceeding.

- [ ] **Step 3: Run all tests**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test
```

Expected: All tests pass (Dimensions: 8, Price: 7, ProductEntity: 10 = 25 total)

- [ ] **Step 4: Commit**

```bash
git add apps/product/src/app.module.ts
git commit -m "feat: wire app module with config and infrastructure"
```

---

## Task 9: Jest Configuration

**Files:**
- Create: `apps/product/jest.config.js`
- Modify: `apps/product/package.json` (ensure test script works)

- [ ] **Step 1: Create `jest.config.js`**

Create `apps/product/jest.config.js`:

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],
};
```

- [ ] **Step 2: Run all tests**

```bash
cd /home/fhung210/learning/woodshop/apps/product && pnpm test
```

Expected: 25 tests pass across 3 test files

- [ ] **Step 3: Commit**

```bash
git add apps/product/jest.config.js
git commit -m "chore: add jest configuration for product service"
```

---

## Self-Review

**1. Spec coverage check:**

| Spec Section | Task | Status |
|---|---|---|
| Architecture & File Structure | All tasks | ✅ |
| Prisma Schema (Product, Category, WoodSpecies enum) | Task 3 | ✅ |
| Repository Interfaces (IProductRepository, ICategoryRepository) | Task 6 | ✅ |
| Repository Implementations (PrismaProductRepository, PrismaCategoryRepository) | Task 7 | ✅ |
| Value Objects (Dimensions, Price) | Task 4 | ✅ |
| Entities (ProductEntity, CategoryEntity) | Task 5 | ✅ |
| Domain Exceptions (DomainError, ProductNotFoundException) | Task 6 | ✅ |
| Database Package (PrismaService, DatabaseModule) | Task 1 | ✅ |
| Wiring & Bootstrap (AppModule, main.ts) | Task 2, 8 | ✅ |
| Supporting Types (ProductFilter, PaginationParams, etc.) | Task 6 | ✅ |

**2. Placeholder scan:** No TBD, TODO, or "implement later" found. All code blocks are complete.

**3. Type consistency:**
- `WoodSpecies` is consistently used as enum (imported from `@prisma/client`) across entity, repository interface, repository impl, and domain types
- `Price` and `Dimensions` value objects used consistently in entity, input types, and filter
- `IProductRepository` token string matches between interface definition and module provider
- `ProductEntityProps` interface used in entity constructor and repository `toEntity` method

**4. Notes:**
- `Price` and `Dimensions` are properly instantiated in `toEntity` (not plain objects), ensuring domain invariants are preserved
