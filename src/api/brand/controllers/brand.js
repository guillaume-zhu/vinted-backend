"use strict";

/**
 * brand controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::brand.brand", ({ strapi }) => ({
  async getBrandsByCategory(ctx) {
    const categoryName = ctx.params.categoryName;

    if (!categoryName) {
      return ctx.badRequest("Category name is required");
    }

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
        populate: ["brand"],
      });

      // Récupérer tableau d'id des brand sans doublons avec map + [...new set()]
      const brandId = [
        ...new Set(
          offers.map((offer) => {
            return offer.brand.id;
          })
        ),
      ];
      //   console.log("brandId ---->", brandId);

      const brands = await strapi.entityService.findMany("api::brand.brand", {
        filters: {
          id: {
            $in: brandId,
          },
        },
        populate: ["*"],
        sort: { name: "asc" },
      });

      return brands;
    } catch (err) {
      strapi.log.error("Erreur searching brands by category", err);
    }
  },
}));
