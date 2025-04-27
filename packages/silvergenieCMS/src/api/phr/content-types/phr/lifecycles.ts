module.exports = {
  afterCreate(event) {
    const { result, params } = event;
    strapi
      .service("api::phr.phr")
      .generatePhrPdf(result.id)
      .then((d) => {
        // console.log(d);
      });
  },
  afterUpdate(event) {
    const { result, params } = event;
    // console.log(JSON.stringify(result));
    strapi
      .service("api::phr.phr")
      .generatePhrPdf(result.id)
      .then((d) => {
        // console.log(d);
      });
  },
};
