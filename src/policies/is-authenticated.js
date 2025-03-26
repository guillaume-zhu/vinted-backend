"use strict";
const { UnauthorizedError } = require("@strapi/utils").errors;

module.exports = async (ctx, config, { strapi }) => {
  if (ctx.state.user) {
    return true;
  }

  return new UnauthorizedError("Vous devez être connecté");
};
