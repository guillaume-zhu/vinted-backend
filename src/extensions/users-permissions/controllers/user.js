// src/extensions/users-permissions/controllers/user.js // user.js
"use strict";

const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
const { UnauthorizedError } = require("@strapi/utils").errors;

module.exports = {
  async changePassword(ctx) {
    // récupérer l'utilisateur
    const user = ctx.state.user;

    // extraire les deux champs currentPassword & newPassword que le front enverra dans la requête
    const { currentPassword, newPassword } = ctx.request.body;

    //// erreur si non connecté
    if (!user) {
      throw new UnauthorizedError("Vous devez être connecté");
    }

    //// erreur si manque un mot de passe
    if (!currentPassword || !newPassword) {
      throw new ApplicationError("Mot de passe actuel et nouveau requis");
    }

    // utiliser le service de Strapi pour comparer mdp entré (currentPassword) avec celui enregistré dans la base (hashé)
    const isValid = await strapi
      .plugin("users-permissions")
      .service("user")
      .validatePassword(currentPassword, user.password);

    //// erreur si mdp entré est faux
    if (!isValid) {
      const error = new ApplicationError("Mot de passe actuel incorrect");
      error.status = 400;
      throw error;
    }

    // requête pour mettre à jour le mot de passe et hashé automatiquement par Strapi
    await strapi.entityService.update(
      "plugin::users-permissions.user",
      user.id,
      {
        data: {
          password: newPassword,
        },
      }
    );

    ctx.send({ message: "Mot de passe mis à jour avec succès" });
  },
};
