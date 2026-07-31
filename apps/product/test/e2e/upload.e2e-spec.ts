import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('UploadController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /upload không có file → 400 FILE_REQUIRED', async () => {
    const res = await request(app.getHttpServer())
      .post('/upload')
      .expect(400);

    expect(res.body.error).toBe('FILE_REQUIRED');
  });

  it('POST /upload file sai định dạng → 400 INVALID_FILE_TYPE', async () => {
    const res = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', Buffer.from('not an image'), 'test.txt')
      .expect(400);

    expect(res.body.error).toBe('INVALID_FILE_TYPE');
  });

  it('POST /upload file quá lớn → 400 FILE_TOO_LARGE', async () => {
    // Tạo buffer > 5MB
    const bigFile = Buffer.alloc(6 * 1024 * 1024, 1);
    const res = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', bigFile, 'big.png')
      .expect(400);

    expect(res.body.error).toBe('FILE_TOO_LARGE');
  });
});
