import admin from "../../../../lib/firebaseConfig/init-admin";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

// Generate new claims role based on the url path, using post method
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const role = req.query.role;
  const { user_id } = req.body;
  const claims = { role: role };

  try {
    await admin.auth().setCustomUserClaims(user_id, claims);
    res.status(200).json({ message: "Success" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
