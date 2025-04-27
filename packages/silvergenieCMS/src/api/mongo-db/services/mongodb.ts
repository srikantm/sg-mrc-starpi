/**
 * mongoDb service
 */
import { connect } from "mongoose";

export default () => ({
  getConnection: async () => {
    const mongo_uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
    // console.log(mongo_uri);
    return await connect(mongo_uri, {});
  },
});
