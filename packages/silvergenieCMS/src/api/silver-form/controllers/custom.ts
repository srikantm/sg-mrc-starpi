import jsoncsv from "json-csv";
import moment from "moment";

export default {
  generateCSV: async (ctx, next) => {
    const { id } = ctx.request.params;
    const formData = await strapi.entityService.findMany(
      "api::silver-form-submit.silver-form-submit",
      {
        filters: {
          silver_form: id,
        },
      }
    );
    // const formData = {};
    const items = formData.map((item) => item.details);
    let fields: any = [];
    for (const obj of items) {
      fields = fields.concat(Object.keys(obj));
    }
    fields = new Set(fields);
    fields = [...fields].map((f) => ({ name: f, label: f }));
    const csv = await jsoncsv.buffered(items, {
      fields: fields,
    });
    try {
      ctx.body = csv;
      // ctx.body = "arpit,2";
      ctx.res.writeHead(200, {
        "Content-Type": "application/csv",
        "Content-Disposition": `attachment; filename=document.csv`,
      });
    } catch (err) {
      ctx.body = err;
    }
  },
};
