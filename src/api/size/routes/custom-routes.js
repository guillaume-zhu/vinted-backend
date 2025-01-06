"use strict";

/**
 * Custom routes for filtering sizes by category
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/sizes/category/:categoryName",
      handler: "size.getSizesByCategory",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
