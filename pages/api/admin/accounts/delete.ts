import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../../interface/response";
import admin from "../../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const { id } = req.body;

      // Delete user in firebase auth
      await admin.auth().deleteUser(id);

      // Delete user in firestore
      await admin.firestore().collection("users").doc(id).delete();

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
