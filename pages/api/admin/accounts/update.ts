import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../../interface/response";
import admin from "../../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const { id, identifier, name, role } = req.body;

      // Update user in firebase auth
      await admin.auth().updateUser(id, {
        displayName: name,
      });

      // Create role custom claims
      await admin.auth().setCustomUserClaims(id, {
        role,
      });

      // Firestore timestamp
      let modifiedAt = admin.firestore.Timestamp.fromDate(new Date());

      // Update user in firestore
      await admin.firestore().collection("users").doc(id).update({
        name,
        identifier,
        role,
        modifiedAt,
      });

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
