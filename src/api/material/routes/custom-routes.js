"use strict";

const { routes } = require("../../brand/routes/custom-routes");

/**
 * Custom routes for filtering materials by category
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/materials/category/:categoryName",
      handler: "material.getMaterialsByCategory",
    },
  ],
};
