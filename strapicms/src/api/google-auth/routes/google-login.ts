export default {
  routes: [
    {
      method: "POST",
      path: "/auth/google-login",
      handler: "google-login.googleLogin",
      config: { auth: false },
    },
  ],
};
