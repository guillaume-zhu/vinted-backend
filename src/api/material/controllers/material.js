"use strict";

const category = require("../../category/controllers/category");

/**
 * material controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::material.material",
  ({ strapi }) => ({
    async getMaterialsByCategory(ctx) {
      const categoryName = ctx.params.categoryName;
      //   console.log("categoryName ---->", categoryName);

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
          populate: ["materials"],
        });

        const materials = offers.map((offer) => offer.materials).flat();

        const uniqueMaterials = materials.filter(
          (material, index, self) =>
            index === self.findIndex((m) => m.id === material.id)
        );
        // console.log("uniqueMaterials ---->", uniqueMaterials);

        return uniqueMaterials;
      } catch (err) {
        strapi.log.error("Error searching material by category");
      }
    },
  })
);
