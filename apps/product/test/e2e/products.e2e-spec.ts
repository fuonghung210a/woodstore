import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  // Product được tạo trong test — cần cleanup sau
  const testProduct = {
    name: 'E2E Test Product',
    slug: `e2e-test-product-${Date.now()}`,
    price: 990000,
    woodSpecies: 'HUONG',
    stockQuantity: 3,
  };
  let createdProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    // Cleanup: xoá sản phẩm test nếu còn
    if (createdProductId) {
      await prisma.product.delete({ where: { id: createdProductId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  it('GET /products → trả danh sách có phân trang', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('limit');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.page).toBe(1);
  });

  it('GET /products?limit=5 → giới hạn số lượng', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?limit=5')
      .expect(200);

    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.limit).toBe(5);
  });

  it('GET /products?search= → tìm theo tên', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?search=hoành phi')
      .expect(200);

    expect(res.body.total).toBeGreaterThan(0);
    expect(
      res.body.data.every((p: { name: string }) =>
        p.name.toLowerCase().includes('hoành phi'),
      ),
    ).toBe(true);
  });

  it('GET /products?minPrice&maxPrice= → lọc theo khoảng giá', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?minPrice=2000000&maxPrice=5000000')
      .expect(200);

    expect(res.body.total).toBeGreaterThan(0);
    expect(
      res.body.data.every(
        (p: { price: { amount: number } }) =>
          p.price.amount >= 2000000 && p.price.amount <= 5000000,
      ),
    ).toBe(true);
  });

  it('GET /products/homepage → categories + featured + newest', async () => {
    const res = await request(app.getHttpServer())
      .get('/products/homepage')
      .expect(200);

    expect(res.body).toHaveProperty('categories');
    expect(res.body).toHaveProperty('featuredProducts');
    expect(res.body).toHaveProperty('newestProducts');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
    expect(res.body.newestProducts.length).toBeLessThanOrEqual(8);
  });

  it('GET /products/:id với ID không tồn tại → 404 PRODUCT_NOT_FOUND', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app.getHttpServer())
      .get(`/products/${fakeId}`)
      .expect(404);

    expect(res.body.error).toBe('PRODUCT_NOT_FOUND');
    expect(res.body.statusCode).toBe(404);
  });

  it('POST /products → tạo sản phẩm thành công (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send(testProduct)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(testProduct.name);
    expect(res.body.slug).toBe(testProduct.slug);
    expect(res.body.price.amount).toBe(testProduct.price);
    expect(res.body.woodSpecies).toBe(testProduct.woodSpecies);

    createdProductId = res.body.id;
  });

  it('POST /products với body thiếu → 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Thiếu fields' })
      .expect(400);

    expect(res.body.statusCode).toBe(400);
  });

  it('GET /products/:id → lấy sản phẩm vừa tạo', async () => {
    const res = await request(app.getHttpServer())
      .get(`/products/${createdProductId}`)
      .expect(200);

    expect(res.body.id).toBe(createdProductId);
    expect(res.body.name).toBe(testProduct.name);
  });

  it('PATCH /products/:id → cập nhật giá', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/products/${createdProductId}`)
      .send({ price: 1200000 })
      .expect(200);

    expect(res.body.price.amount).toBe(1200000);
  });

  it('PATCH /products/:id với ID không tồn tại → 404', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .patch(`/products/${fakeId}`)
      .send({ price: 1000 })
      .expect(404);
  });

  it('GET /products/featured → danh sách sản phẩm nổi bật', async () => {
    const res = await request(app.getHttpServer())
      .get('/products/featured')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /products/by-wood/HUONG → lọc theo loại gỗ', async () => {
    const res = await request(app.getHttpServer())
      .get('/products/by-wood/HUONG')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body.every((p: { woodSpecies: string }) => p.woodSpecies === 'HUONG')).toBe(true);
    }
  });

  it('DELETE /products/:id → soft delete thành công', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${createdProductId}`)
      .expect(200);

    // Sau khi soft delete, GET phải 404
    await request(app.getHttpServer())
      .get(`/products/${createdProductId}`)
      .expect(404);
  });
});
