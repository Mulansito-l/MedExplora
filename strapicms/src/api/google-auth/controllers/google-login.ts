import { Context } from "koa";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ALLOWED_DOMAIN = "uabc.edu.mx";

export default {
  async googleLogin(ctx: Context) {
    console.log("CONTROLLER LOADED AS:", __filename);
    try {
      const { credential } = ctx.request.body as { credential?: string };

      if (!credential) {
        return ctx.badRequest("Missing Google credential");
      }

      // Verificar token con Google
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload: any = ticket.getPayload();
      const email: string = payload.email;

      // Validar dominio institucional
      if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        return ctx.unauthorized("Debe usar su correo institucional");
      }

      // Buscar usuario en Strapi
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { email } });

      let finalUser = user;

      // Si no existe, crearlo
      if (!user) {
        finalUser = await strapi.db
          .query("plugin::users-permissions.user")
          .create({
            data: {
              username: payload.name,
              email,
              provider: "google",
              confirmed: true,
              blocked: false,
            },
          });
      }

      // Emitir JWT de Strapi
      const token = strapi.plugins["users-permissions"].services.jwt.issue({
        id: finalUser.id,
      });

      return (ctx.body = {
        jwt: token,
        user: finalUser,
      });

    } catch (err) {
      console.error(err);
      return ctx.internalServerError("Error verifying Google token");
    }
  },
};
