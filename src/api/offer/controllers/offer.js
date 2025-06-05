"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

const codeFriendlyConvert = (string) => {
  //// transformer string sans accents + lowerCase
  let stringWithoutAccentMin = string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  //// remplacer les caractères spéciaux par " "
  let finalString = stringWithoutAccentMin.replace(/[&'!?]/g, " ");

  //// Supprimer espaces et convertir la première lettre des éléments en MAJ
  const tab = finalString.split(" ");
  /// boucler sur le tableau et ajouter les éléments non vides
  const newTab = [];
  for (let i = 0; i < tab.length; i++) {
    let elementToAdd = "";
    let firstLetter = "";
    if (tab[i] !== "") {
      elementToAdd = tab[i];
      firstLetter = elementToAdd[0].toUpperCase();
      newTab.push(firstLetter + elementToAdd.slice(1));
    }
  }

  //// lowerCase le premier élément du tableau
  newTab[0] = newTab[0].toLowerCase();
  //// convertir le tableau en string et le retourner
  return newTab.join("");
};

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  // MODIFICATION DE LA ROUTE CREATE LORS DE LA CRÉATION D'UNE OFFRE AVEC !!!CUSTOM BRAND!!!
  // ---> 1) Créer custom brand dans la collection brands s'il y a une custom brand de renseignée
  // ---> 2) Lier cette nouvelle brand au body de l'offre
  // ---> 3) Appliquer super create fonctionnement normal
  // ---> 4) Lier le champ offer de la brand créée avec l'id de l'offre créée
  async create(ctx) {
    try {
      //// récupérer les data du form et les stocker dans une variable body
      const offerData = ctx.request.body.data;
      // console.log("offerData ------>", offerData);

      //// récupérer les informations de l'utilisateur qui créée l'offre
      const userInfo = ctx.state.user;
      // console.log("userInfo ------>", userInfo);

      //////// cas 1 : si une custom brand est choisie
      if (offerData.customBrand) {
        ////// créer cette custom brand dans la collections brands avec les champs : {
        // - name : fonction customBrand (pour rendre code friendly) /
        // - statut : pending /
        // - createdByUser : yes /
        // - displayName : custom brand name / }
        const newBrand = await strapi.entityService.create("api::brand.brand", {
          data: {
            name: codeFriendlyConvert(offerData.customBrand),
            status: "pending",
            createdByUser: true,
            displayName: offerData.customBrand,
            isPopular: false,
          },
        });
        // console.log("Custom brand created ---->", newBrand);

        ////// associer le dataOffer.brand = la nouvelle collection
        //// trouver l'ID de la customBrand créée
        //// associer cet ID au champ brand de offerData
        offerData.brand = newBrand.id;
        //////// supprimer le contenu de custom brand
        delete offerData.customBrand;
        // console.log("offerData updated with new brand ----->", offerData);
      }

      //////// réattribuer ctx + appeler le fonctionnement normal du controller create et créer l'offre
      ctx.request.body.data = offerData;
      const response = await super.create(ctx);

      return response;
    } catch (err) {
      // Journaliser l'erreur pour le débogage
      strapi.log.error("Erreur creating offer :", err);

      // Re-throw pour conserver la gestion automatique des erreurs
      throw err;
    }
  },

  // CONTROLLER BUY
  async buy(ctx) {
    try {
      const { status } = await stripe.charges.create({
        amount: ctx.request.body.amount * 100,
        currency: "eur",
        description: `Paiement Vinted pour : ${ctx.request.body.title}`,
        source: ctx.request.body.token,
      });

      return { status: status };
    } catch (err) {
      strapi.log.error("Erreur buy offer :", err);
    }
  },

  // RECHERCHE DES OFFRES PAR CATÉGORIE ID
  // async findByCategories(ctx) {
  //   try {
  //     // console.log("📩 ctx.request.body", ctx.request.body);

  //     const { categoryIds } = ctx.request.body;

  //     const page = Number(ctx.query.page) || 1;
  //     const pageSize = 96;

  //     const offers = await strapi.entityService.findMany("api::offer.offer", {
  //       filters: {
  //         category: {
  //           id: {
  //             $in: categoryIds,
  //           },
  //         },
  //       },
  //       populate: {
  //         images: true,
  //         category: true,
  //         colors: true,
  //         materials: true,
  //         owner: true,
  //         brand: true,
  //         size: true,
  //       },
  //       pagination: {
  //         page,
  //         pageSize,
  //       },
  //     });

  //     const total = await strapi.entityService.count("api::offer.offer", {
  //       filters: {
  //         category: {
  //           id: {
  //             $in: categoryIds,
  //           },
  //         },
  //       },
  //     });

  //     const pageCount = Math.ceil(total / pageSize);

  //     return {
  //       data: offers,
  //       meta: {
  //         pagination: {
  //           page,
  //           pageSize,
  //           pageCount,
  //           total,
  //         },
  //       },
  //     };
  //   } catch (error) {
  //     console.error("💥 Erreur dans findByCategories:", error);
  //     ctx.throw(500, "Erreur interne lors de la recherche des offres.");
  //   }
  // },
}));
