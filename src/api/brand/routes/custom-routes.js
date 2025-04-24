"use strict";

/**
 * Custom routes for filtering brands by category
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/brands/category/:categoryName",
      handler: "brand.getBrandsByCategory",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
