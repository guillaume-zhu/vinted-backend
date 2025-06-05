// POLICY IS OWNER ?

module.exports = async (policyContext, config, { strapi }) => {
  /// récupérer l'id de l'user
  const userId = policyContext.state.user.id;

  /// récupérer l'id de l'offre ciblée
  const offerId = policyContext.params.id;

  /// récupérer l'id de la clé owner de l'offre avec strapi.entity.find + populate
  const offer = await strapi.entityService.findOne(
    "api::offer.offer",
    offerId,
    { populate: ["owner"] }
  );

  const ownerId = offer.owner.id;

  /// comparer l'id user vs l'id de la clé owner de l'offre ///
  /////// si userId = ownerId
  if (userId === ownerId) {
    return true;
    /////// si userId !== ownerID
    ///////// retourner false et message erreur client
  } else {
    return false;
  }
  ///////// retourner ok true
};
