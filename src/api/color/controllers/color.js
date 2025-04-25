"use strict";

const category = require("../../category/controllers/category");

/**
 * color controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::color.color", ({ strapi }) => ({
  async getColorsByCategory(ctx) {
    const categoryName = ctx.params.categoryName;

    if (!categoryName) {
      return ctx.badRequest("Category name is required");
    }

    // Faire requete avec categoryName pour récupérer les offres disponibles
    try {
      const offers = await strapi.entityService.findMany("api::offer.offer", {
        filters: {
          category: {
            name: {
              $containsi: categoryName,
            },
          },
        },
        pagination: { pageSize: 200 },
        populate: ["colors"],
      });

      // Récupérer les relations name colors dans un tableau sans doublon avec map + [... new Set()]
      const colors = offers.map((offer) => offer.colors).flat();
      const uniqueColors = colors.filter(
        (color, index, self) =>
          index === self.findIndex((c) => c.name === color.name)
      );

      return uniqueColors;
    } catch (err) {
      strapi.log.error("Error searching colors by category");
    }
  },
}));
