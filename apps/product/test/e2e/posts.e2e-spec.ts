import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  const testPost = {
    title: 'E2E Test Post',
    slug: `e2e-test-post-${Date.now()}`,
    content: 'Nội dung bài viết test e2e',
    excerpt: 'Tóm tắt bài viết',
    tags: ['test', 'e2e'],
    status: 'DRAFT',
    author: 'Nghệ nhân Test',
  };
  let createdPostId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    if (createdPostId) {
      await prisma.post.delete({ where: { id: createdPostId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  it('POST /posts → tạo bài viết DRAFT (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts')
      .send(testPost)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(testPost.title);
    expect(res.body.slug).toBe(testPost.slug);
    expect(res.body.status).toBe('DRAFT');
    expect(res.body.publishedAt).toBeNull();
    expect(res.body.tags).toEqual(['test', 'e2e']);

    createdPostId = res.body.id;
  });

  it('POST /posts với status PUBLISHED → tự set publishedAt', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts')
      .send({
        ...testPost,
        slug: `${testPost.slug}-published`,
        title: 'E2E Published Post',
        status: 'PUBLISHED',
      })
      .expect(201);

    expect(res.body.status).toBe('PUBLISHED');
    expect(res.body.publishedAt).not.toBeNull();

    await prisma.post.delete({ where: { id: res.body.id } }).catch(() => {});
  });

  it('POST /posts thiếu title → 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts')
      .send({ slug: 'no-title', content: 'abc' })
      .expect(400);

    expect(res.body.statusCode).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('GET /posts → danh sách bài viết (có DRAFT)', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /posts?status=PUBLISHED → chỉ bài đã xuất bản', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts?status=PUBLISHED')
      .expect(200);

    expect(res.body.data.every((p: { status: string }) => p.status === 'PUBLISHED')).toBe(true);
  });

  it('GET /posts?search= → tìm theo tiêu đề', async () => {
    const res = await request(app.getHttpServer())
      .get(`/posts?search=${encodeURIComponent('E2E Test Post')}`)
      .expect(200);

    expect(res.body.total).toBeGreaterThan(0);
    expect(
      res.body.data.some((p: { title: string }) => p.title === testPost.title),
    ).toBe(true);
  });

  it('GET /posts/published → chỉ bài published (cho website)', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts/published')
      .expect(200);

    expect(res.body.data.every((p: { status: string }) => p.status === 'PUBLISHED')).toBe(true);
  });

  it('GET /posts/:id → chi tiết bài viết', async () => {
    const res = await request(app.getHttpServer())
      .get(`/posts/${createdPostId}`)
      .expect(200);

    expect(res.body.id).toBe(createdPostId);
    expect(res.body.title).toBe(testPost.title);
  });

  it('GET /posts/slug/:slug → chi tiết theo slug', async () => {
    const res = await request(app.getHttpServer())
      .get(`/posts/slug/${testPost.slug}`)
      .expect(200);

    expect(res.body.id).toBe(createdPostId);
  });

  it('GET /posts/:id không tồn tại → 404 POST_NOT_FOUND', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app.getHttpServer())
      .get(`/posts/${fakeId}`)
      .expect(404);

    expect(res.body.error).toBe('POST_NOT_FOUND');
  });

  it('PATCH /posts/:id → publish bài viết', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/posts/${createdPostId}`)
      .send({ status: 'PUBLISHED', metaTitle: 'SEO Title' })
      .expect(200);

    expect(res.body.status).toBe('PUBLISHED');
    expect(res.body.publishedAt).not.toBeNull();
    expect(res.body.metaTitle).toBe('SEO Title');
  });

  it('DELETE /posts/:id → soft delete', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/${createdPostId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/posts/${createdPostId}`)
      .expect(404);
  });
});
