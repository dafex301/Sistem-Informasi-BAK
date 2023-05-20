import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../interface/response";
import admin from "../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    // Get all user that have role UKM and change it to ormawa
    const users = await admin
      .firestore()
      .collection("users")
      .where("role", "==", "UKM")
      .get();

    users.forEach(async (user) => {
      await admin
        .firestore()
        .collection("users")
        .doc(user.id)
        .update({ role: "ORMAWA" });

      await admin.auth().setCustomUserClaims(user.id, { role: "ORMAWA" });
    });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
