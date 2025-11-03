import { setupStrapi } from './tests/helpers/strapi';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  if (global.strapi) {
    await global.strapi.destroy();
  }
});