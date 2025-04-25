"use strict";

/**
 * Custom routes for filtering colors by offers by category
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/colors/category/:categoryName",
      handler: "color.getColorsByCategory",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
