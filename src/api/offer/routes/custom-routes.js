"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/offers/buy",
      handler: "offer.buy",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
