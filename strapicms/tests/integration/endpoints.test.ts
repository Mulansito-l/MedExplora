import request from 'supertest';

describe('📡 Strapi endpoints', () => {
  it('Strapi debe inicializarse correctamente', () => {
    expect(global.strapi).toBeDefined();
  });

  it('Debe responder el endpoint /api/cabeza', async () => {
    const res = await request(global.strapi.server.httpServer).get('/api/cabeza');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('Debe responder el endpoint /api/torso', async () => {
    const res = await request(global.strapi.server.httpServer).get('/api/torso');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('Debe responder el endpoint /api/pierna', async () => {
    const res = await request(global.strapi.server.httpServer).get('/api/pierna');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('Debe responder el endpoint /api/brazo', async () => {
    const res = await request(global.strapi.server.httpServer).get('/api/brazo');
    expect([200, 404]).toContain(res.statusCode);
  });

  it('Debe responder el endpoint /api/pie', async () => {
    const res = await request(global.strapi.server.httpServer).get('/api/pie');
    expect([200, 404]).toContain(res.statusCode);
  });
});