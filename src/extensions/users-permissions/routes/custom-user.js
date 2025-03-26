// src/extensions/users-permissions/routes/custom-user.js // custom-user.js
"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/change-password",
      handler: "user.changePassword",
      config: {
        policies: ["global::is-authenticated"],
        type: "custom",
      },
    },
  ],
};
