import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../interface/response";
import admin from "../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    // Check the header for the tokenId firebase
    const tokenId = req.headers.authorization;

    // Check if token is valid
    if (tokenId) {
      // Verify token
      const decodedToken = await admin.auth().verifyIdToken(tokenId);

      // Check if the user is admin
      if (decodedToken.is_admin) {
        // Get the email from the body
        const { email } = req.body;

        // Get the user from firebase
        const user = await admin.auth().getUserByEmail(email);

        // Delete the user from firebase auth
        await admin.auth().deleteUser(user.uid);

        // Delete user from firestore
        const userRef = await admin
          .firestore()
          .collection("users")
          .where("email", "==", email)
          .get();

        userRef.forEach((doc) => {
          doc.ref.delete();
        });
        res.status(200).json({ message: "Success" });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
