"use strict";

/**
 * size controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::size.size", ({ strapi }) => ({
  async getSizesByCategory(ctx) {
    //   console.log("getSizesByCategory hitpoint ------");
    console.log("ctx params categoryName ------->", ctx.params.categoryName);

    const categoryName = ctx.params.categoryName;
    console.log("categoryName ------>", categoryName);

    if (!categoryName) {
      return ctx.badRequest("Category name is required");
    }

    try {
      // déclarer sizeCategory
      let sizeCategory = "";

      //// logique si include "nom-categorie-recherchée" affecter sizeCategory
      //  search size femmesVetements
      if (categoryName.includes("femmes-vetements") === true) {
        sizeCategory = "femmesVetements";
      }
      //  search size femmesChaussures
      else if (categoryName.includes("femmes-chaussures") === true) {
        sizeCategory = "femmesChaussures";
      }
      //  search size hommesCostumes
      else if (
        categoryName.includes("hommes-vetements-costumes-blazers") === true ||
        categoryName.includes("hommes-vetements-costumes-gilets") === true ||
        categoryName.includes("hommes-vetements-costumes-ensembles") === true ||
        categoryName.includes("hommes-vetements-costumes-mariage") === true ||
        categoryName.includes("hommes-vetements-costumes-autres") === true
      ) {
        sizeCategory = "hommesCostumes";
      }
      //  search size hommesHauts
      else if (
        categoryName.includes("hommes-vetements-costumes-pantalons") === true ||
        categoryName.includes("hommes-vetements-hautsTshirts") === true ||
        categoryName.includes("hommes-vetements-manteauxVestes") === true ||
        categoryName.includes("hommes-vetements-sweatsPulls") === true ||
        categoryName.includes("hommes-vetements-sousVetements") === true ||
        categoryName.includes("hommes-vetements-pyjamas") === true ||
        categoryName.includes("hommes-vetements-maillots") === true ||
        categoryName.includes("hommes-vetements-sportsAccessoires") === true ||
        categoryName.includes("hommes-vetements-specialises") === true ||
        categoryName.includes("hommes-vetements-autres") === true
      ) {
        sizeCategory = "hommesHauts";
      }
      //  search size hommesPantalons
      else if (
        categoryName.includes("hommes-vetements-jeans") === true ||
        categoryName.includes("hommes-vetements-pantalons") === true ||
        categoryName.includes("hommes-vetements-shorts") === true
      ) {
        sizeCategory = "hommesPantalons";
      }
      //  search size hommesChaussures
      else if (categoryName.includes("hommes-chaussures") === true) {
        sizeCategory = "hommesChaussures";
      }
      //  search size enfantsChaussures
      else if (
        categoryName.includes("enfants-filles-chaussures") === true ||
        categoryName.includes("enfants-garcons-chaussures") === true
      ) {
        sizeCategory = "enfantsChaussures";
      }
      //  search size enfantsVetements
      else if (
        categoryName.includes("enfants-filles") === true ||
        categoryName.includes("enfants-garcons") === true
      ) {
        sizeCategory = "enfantsVetements";
      }
      //  no size
      else {
        sizeCategory = "no size";
      }

      //// si la sizeCategory recherchée à une size

      if (sizeCategory) {
        // chercher avec entityService find many avec filtre sizeCategory
        console.log("sizeCategory to filter ------>", sizeCategory);
        const sizes = await strapi.entityService.findMany("api::size.size", {
          filters: { sizeCategory: sizeCategory },
        });

        // vérifier le resultat
        console.log(sizes);
        // return le resultat
        return sizes;
      }
    } catch (err) {
      // Journaliser l'erreur pour le débogage
      strapi.log.error("Erreur creating offer :", err);

      // Re-throw pour conserver la gestion automatique des erreurs
      throw err;
    }
  },
}));
