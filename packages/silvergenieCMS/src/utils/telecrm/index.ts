import { getTeleCrmClient } from "./client";

export const putLeadInTelecrm = async (data) => {
  const client = getTeleCrmClient();

  try {
    const res = await client.post("/", data);

    if (res.status == 200) {
      console.log("Lead pushed to telecrm successfully!");
      return;
    }
    throw new Error(`Telecrm push failed, ${res.statusText}`);
  } catch (error) {
    console.error("Failed to process the lead to teleCRM:", error);
    throw new Error(`Error in processing telecrm lead ${error}`);
  }
};
