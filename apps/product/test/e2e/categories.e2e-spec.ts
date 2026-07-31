import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  const testCategory = {
    name: 'E2E Test Category',
    slug: `e2e-test-category-${Date.now()}`,
    description: 'Danh mục tạo trong test',
    sortOrder: 99,
  };
  let createdCategoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    if (createdCategoryId) {
      await prisma.category.delete({ where: { id: createdCategoryId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  it('GET /categories → danh sách danh mục', async () => {
    const res = await request(app.getHttpServer()).get('/categories').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /categories?onlyActive=true → chỉ danh mục active', async () => {
    const res = await request(app.getHttpServer())
      .get('/categories?onlyActive=true')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((c: { isActive: boolean }) => c.isActive === true)).toBe(true);
  });

  it('POST /categories → tạo danh mục thành công (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/categories')
      .send(testCategory)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(testCategory.name);
    expect(res.body.slug).toBe(testCategory.slug);
    expect(res.body.isActive).toBe(true);

    createdCategoryId = res.body.id;
  });

  it('POST /categories với body thiếu → 400', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({})
      .expect(400);
  });

  it('GET /categories/:id → chi tiết danh mục vừa tạo', async () => {
    const res = await request(app.getHttpServer())
      .get(`/categories/${createdCategoryId}`)
      .expect(200);

    expect(res.body.id).toBe(createdCategoryId);
    expect(res.body.name).toBe(testCategory.name);
  });

  it('GET /categories/:id với ID không tồn tại → 404 CATEGORY_NOT_FOUND', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app.getHttpServer())
      .get(`/categories/${fakeId}`)
      .expect(404);

    expect(res.body.error).toBe('CATEGORY_NOT_FOUND');
  });

  it('GET /categories/:id/children → danh mục con (rỗng với category không có con)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/categories/${createdCategoryId}/children`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PATCH /categories/:id → cập nhật mô tả', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/categories/${createdCategoryId}`)
      .send({ description: 'Mô tả đã cập nhật' })
      .expect(200);

    expect(res.body.description).toBe('Mô tả đã cập nhật');
  });

  it('PATCH /categories/:id với ID không tồn tại → 404', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .patch(`/categories/${fakeId}`)
      .send({ description: 'Không tồn tại' })
      .expect(404);
  });
});
