import { createStrapi } from '@strapi/strapi';
import type { Strapi } from '@strapi/types/dist/core';

let instance: Strapi | null = null;

export async function setupStrapi() {
  if (!instance) {
    instance = await createStrapi({
      // Esto asegura que Strapi se inicialice con el entorno correcto
      appDir: process.cwd(),
      distDir: 'dist', // opcional si estás en TS puro
    });

    await instance.load();
    await instance.server.mount();

    global.strapi = instance;
  }

  return instance;
}

export async function teardownStrapi() {
  if (instance) {
    await instance.destroy();
    instance = null;
  }
}