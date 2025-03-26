// src/extensions/users-permissions/strapi-server.js // strapi-server.js

module.exports = (plugin) => {
  const register = plugin.controllers.auth.register;

  /////// AJOUT DE LA GESTION DE L'UPLOAD AVATAR
  plugin.controllers.auth.register = async (ctx) => {
    // Création normale du user sans l'image
    await register(ctx);

    if (ctx.request.files?.avatar) {
      // Si j'ai reçu une clef avatar
      // Je vais chercher l'utilisateur qui vient d'être créé afin d'avoir accès à son id
      const user = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        { filters: { username: ctx.request.body.username } }
      );
      // Upload de l'image, en local ou sur cloudinary, et lien du user à l'image
      const uploadResponse = await strapi.plugins.upload.services.upload.upload(
        {
          data: {
            refId: user[0].id, // id de l'utilisateur nouvellement créé
            ref: "plugin::users-permissions.user", // la collection à laquelle appartient le user
            field: "avatar", // /!\ NOM DE LA CLEF FAISANT RÉFÉRENCE À L'IMAGE
          },
          files: ctx.request.files.avatar, // /!\ NOM DE LA CLEF DU FORMDATA DANS LAQUELLE L'IMAGE EST
        }
      );
    }
  };

  /////// AJOUT DE LA GESTION PUT UPDATE de l'avatar
  plugin.controllers.user.update = async (ctx) => {
    const userId = ctx.params.id; // Récupère l'ID de l'utilisateur

    // Mise à jour des données utilisateur classiques
    const updatedUser = await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      {
        data: ctx.request.body,
      }
    );

    // 📌 Gestion du nouvel avatar s'il y en a un
    if (ctx.request.files?.avatar) {
      // Supprime l'ancien avatar (optionnel)
      const existingAvatar = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        { filters: { id: userId }, populate: ["avatar"] }
      );

      if (existingAvatar[0]?.avatar?.id) {
        await strapi.plugins.upload.services.upload.remove(
          existingAvatar[0].avatar
        );
      }

      // Upload du nouvel avatar
      await strapi.plugins.upload.services.upload.upload({
        data: {
          refId: userId,
          ref: "plugin::users-permissions.user",
          field: "avatar",
        },
        files: ctx.request.files.avatar,
      });
    }

    // Retourner l'utilisateur avec avatar dans la réponse
    const updatedUserWithAvatar = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        populate: ["avatar"], //  Forcer Strapi à inclure l'avatar
      }
    );

    return updatedUserWithAvatar; //  Retourne l'utilisateur avec l'avatar
  };

  // AJOUT DE LA GESTION DES ROUTES CUSTOM dont CHANGE PASSWORD
  const customRoutes = require("./routes/custom-user").routes;
  for (const route of customRoutes) {
    plugin.routes["content-api"].routes.push(route);
  }

  // ENREGISTREMENT DU CONTROLLER SPÉCIFIQUE CHANGE PASSWORD
  plugin.controllers.user.changePassword =
    require("./controllers/user").changePassword;

  return plugin;
};
