import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { ProductModule } from './product.module';
import { PrismaService } from '../../prisma.service';

describe('ProductController', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();
  const productTestData = [
    {
      label: 'Product 3',
    },
    {
      label: 'Product 5',
    },
    {
      label: 'Product 1',
    },
    {
      label: 'Product Four.',
    },
    {
      label: 'Product 2',
    },
  ];

  beforeAll(async () => {
    await prisma.cleanDatabase();

    await prisma.product.createMany({ data: productTestData });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/product/2 (GET)', async () => {
    const productId = 2;
    const res = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(res.body.label).toEqual(productTestData[1].label);
  });

  it('/products (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);

    expect(res.body.length).toEqual(5);
  });

  it('/products (GET) - limit 2', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?limit=2')
      .expect(200);

    expect(res.body.length).toEqual(2);
  });

  it('/products (GET) - skip 20', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?page=2')
      .expect(200);

    expect(res.body.length).toEqual(0);
  });

  it('/products (GET) - limit 2 skip 2', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?limit=2&page=2')
      .expect(200);

    expect(res.body.length).toEqual(2);
    expect(res.body[0].label).toEqual(productTestData[2].label);
  });

  it('/products (GET) - order asc', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?sort=label(asc)')
      .expect(200);

    console.log(res.body);

    expect(res.body.length).toEqual(5);
    expect(res.body[0].label <= res.body[1].label).toEqual(true);
  });

  it('/products (GET) - order desc', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?sort=label(desc)')
      .expect(200);

    expect(res.body.length).toEqual(5);
    expect(res.body[0].label > res.body[1].label).toEqual(true);
  });

  it("/products (GET) - contains '4.'", async () => {
    const res = await request(app.getHttpServer())
      .get('/products?filter=label[contains]"Four."]')
      .expect(200);

    console.log(res.body);

    expect(res.body.length).toEqual(1);
    expect(res.body[0].label).toContain('Four.');
  });
});
