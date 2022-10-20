import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AreaModule } from './../src/areas/area.module';

describe('AreaController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AreaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/area/2 (GET)', async () => {
    const areaId = 2;
    const res = await request(app.getHttpServer())
      .get(`/areas/${areaId}`)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(areaId); // TODO: Fix when beforeAll insertion is added
  });

  it('/areas (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/areas').expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(4); // TODO: Fix when beforeAll insertion is added
  });

  it('/areas (GET) - limit 2', async () => {
    const res = await request(app.getHttpServer())
      .get('/areas?limit=2')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(2);
  });

  it('/areas (GET) - skip 20', async () => {
    const res = await request(app.getHttpServer())
      .get('/areas?page=1')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('/areas (GET) - limit 2 skip 2', async () => {
    const res = await request(app.getHttpServer())
      .get('/areas?limit=2&skip=2')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(2);
    // expect(res.body[0].id).toEqual(3); TODO: When insert beforeAll is added
  });

  it('/areas (GET) - order asc', async () => {
    const res = await request(app.getHttpServer())
      .get('/areas?order=asc')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(4); // TODO: Fix when beforeAll insertion is added
    expect(res.body[0].label <= res.body[1].label).toEqual(true);
  });

  it('/areas (GET) - order desc', async () => {
    const res = await request(app.getHttpServer())
      .get('/areas?order=desc')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(4); // TODO: Fix when beforeAll insertion is added
    expect(res.body[0].label > res.body[1].label).toEqual(true);
  });

  it("/areas (GET) - contains 'Mt.'", async () => {
    const res = await request(app.getHttpServer())
      .get('/areas?like=Mt.')
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body instanceof Array).toEqual(true);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].label).toContain('Mt.');
  });
});
