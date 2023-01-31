import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../../interface/response";
import admin from "../../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const { identifier, name, role } = req.body;

      // Generate email based on username
      const email = `${name.split(" ").join("").toLowerCase() + "@gmail.com"}`;

      // Create user in firebase auth
      const user = await admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: identifier,
        displayName: name,
        disabled: false,
      });

      // Create role custom claims
      await admin.auth().setCustomUserClaims(user.uid, {
        role,
      });

      // Firestore timestamp
      let created_at = admin.firestore.Timestamp.fromDate(new Date());

      // Create user in firestore
      await admin.firestore().collection("users").doc(user.uid).set({
        email,
        name,
        identifier,
        role,
        created_at,
        modifiedAt: created_at,
      });

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
