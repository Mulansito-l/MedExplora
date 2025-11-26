export default ({ env }) => ({
  url: env("PUBLIC_URL", "http://localhost:1337"),
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),

  app: {
    keys: env.array("APP_KEYS", [
      "key1_super_segura",
      "key2_super_segura",
      "key3_super_segura",
      "key4_super_segura"
    ]),
  },
});
