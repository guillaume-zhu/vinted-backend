"use strict";

/**
 * size controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::size.size", ({ strapi }) => ({
  async getSizesByCategory(ctx) {
    //   console.log("getSizesByCategory hitpoint ------");
    // console.log("ctx params categoryName ------->", ctx.params.categoryName);

    const categoryName = ctx.params.categoryName;
    // console.log("categoryName ------>", categoryName);

    if (!categoryName) {
      return ctx.badRequest("Category name is required");
    }

    try {
      // déclarer sizeCategory
      let sizeCategory = "";

      //// logique si include "nom-categorie-recherchée" affecter sizeCategory

      /// FEMMES
      //  search size femmesVetements
      if (categoryName.includes("femmes-vetements") === true) {
        sizeCategory = "femmesVetements";
      }
      //  search size femmesChaussures
      else if (categoryName.includes("femmes-chaussures") === true) {
        sizeCategory = "femmesChaussures";
      }
      // search size all femmes
      else if (categoryName === "femmes") {
        sizeCategory = "femmes";
      }

      /// HOMMES
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
        categoryName.includes("hommes-vetements-costumes-pantalons") === true ||
        categoryName.includes("hommes-vetements-jeans") === true ||
        categoryName.includes("hommes-vetements-pantalons") === true ||
        categoryName.includes("hommes-vetements-shorts") === true
      ) {
        sizeCategory = "hommesPantalons";
      }
      //  search size all hommes vetements
      else if (categoryName === "hommes-vetements") {
        sizeCategory = "hommes-vetements";
      }
      //  search size hommesChaussures
      else if (categoryName.includes("hommes-chaussures") === true) {
        sizeCategory = "hommesChaussures";
      }
      // search size all hommes
      else if (categoryName === "hommes") {
        sizeCategory = "hommes";
      }

      /// ENFANTS
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
      // search size enfants all
      else if (categoryName === "enfants") {
        sizeCategory = "enfants";
      }

      // MAISON
      //  search size maisonTextilesLingesCouettes
      else if (
        categoryName.includes("maison-textiles-lingeLit-parures") === true ||
        categoryName.includes("maison-textiles-lingeLit-draps") === true ||
        categoryName.includes("maison-textiles-lingeLit-houssesCouette") ===
          true
      ) {
        sizeCategory = "maisonTextilesLingesCouettes";
      }

      //  search size maisonTextilesLingesTaies
      else if (
        categoryName.includes("maison-textiles-lingeLit-taieOreiller") === true
      ) {
        sizeCategory = "maisonTextilesLingesTaies";
      }

      //  search size maisonTextilesCouvertures
      else if (categoryName.includes("maison-textiles-couvertures") === true) {
        sizeCategory = "maisonTextilesCouvertures";
      }

      //  search size maisonTextilesRideaux
      else if (categoryName.includes("maison-textiles-rideaux") === true) {
        sizeCategory = "maisonTextilesRideaux";
      }

      //  search size maisonTextilesCoussins
      else if (categoryName.includes("maison-textiles-coussins") === true) {
        sizeCategory = "maisonTextilesCoussins";
      }

      //  no size
      else {
        sizeCategory = "no size";
      }

      // REQUETES POUR RÉCUPÉRER LES SIZES EN FONCTION DES OFFRES DISPOS
      // Récupérer les offres
      const offers = await strapi.entityService.findMany("api::offer.offer", {
        filters: {
          category: {
            name: {
              $containsi: categoryName,
            },
          },
        },
        populate: ["size"],
        pagination: { pageSize: 200 },
      });

      // Trier les sizes des offres
      const sizes = offers.map((offer) => offer.size).flat();
      const validSizes = sizes.filter((size) => size !== null);
      const uniqueSizes = validSizes.filter(
        (size, index, self) => index === self.findIndex((s) => s.id === size.id)
      );
      const sortedSizes = uniqueSizes.sort((a, b) => a.id - b.id);

      return sortedSizes;
    } catch (err) {
      // Journaliser l'erreur pour le débogage
      strapi.log.error("Erreur searching sizes by category :", err);

      // Re-throw pour conserver la gestion automatique des erreurs
      throw err;
    }
  },
}));
