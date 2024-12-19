"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

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
  async create(ctx) {
    try {
      //// récupérer les data du form et les stocker dans une variable body
      const offerData = ctx.request.body.data;
      console.log("offerData ------>", offerData);

      //// récupérer les informations de l'utilisateur qui créée l'offre
      const userInfo = ctx.state.user;
      console.log("userInfo ------>", userInfo);

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
        console.log("Custom brand created ---->", newBrand);

        ////// associer le dataOffer.brand = la nouvelle collection
        //// trouver l'ID de la customBrand créée
        //// associer cet ID au champ brand de offerData
        offerData.brand = newBrand.id;
        //////// supprimer le contenu de custom brand
        delete offerData.customBrand;
        console.log("offerData updated with new brand ----->", offerData);
      }

      //////// réattribuer ctx + appeler le fonctionnement normal du controller create et créer l'offre
      ctx.request.body.data = offerData;
      const response = await super.create(ctx);

      // - offers : id de l'offre actuelle ? (faire un update PUT après la création de l'offre pour la customBrand créée)
      const updateOfferslinkNewBrand = await strapi.entityService.update(
        "api::brand.brand",
        offerData.brand,
        { data: { offers: response.data.id } }
      );

      // Vous pouvez ajouter une logique personnalisée ici si nécessaire
      return response;
    } catch (err) {
      // Journaliser l'erreur pour le débogage
      strapi.log.error("Erreur creating offer :", err);

      // Re-throw pour conserver la gestion automatique des erreurs
      throw err;
    }
  },
}));
// syntaxe strapi destructuré en argument qui retourne la fonction create
// async create(ctx) { }
// try catch dans create(ctx)
// regler le catch error

/////////////// cas 1 l'utilisateur choisit une marque existante, et créée l'offre

///////// si body.brand existe dans la collection brands alors ->

///////// recupérer les informations de la marque (id)

////////////// cas 2 l'utilisateur créée une nouvelle marque, avec customBrand

///////// sinon si customBrand existe ou cas else

///////// verifier si elle n'existe pas déjà dans la collection brands

///// si oui récuperer et stocker les informations de la marque (id)

///// si non créer une nouvelle marque dans la collection brands avec un status "pending" + récuperer et stocker les informations de la marque créee (id)

//// créer l'offre en associant l'id de la marque finale à form data
