"use strict";

/**
 * offer router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::offer.offer", {
  config: {
    delete: {
      policies: ["api::offer.is-owner"],
    },
    update: {
      policies: ["api::offer.is-owner"],
    },
  },
});
