import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../interface/response";
import admin from "../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    // Check the header for the tokenId firebase
    // const tokenId = req.headers.authorization;

    // Check if token is valid
    // if (tokenId) {
    // Verify token
    // const decodedToken = await admin.auth().verifyIdToken(tokenId);

    // Check if the user is admin
    // if (decodedToken.is_admin) {
    // Get the email from the body
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
      modified_at: created_at,
    });

    res.status(200).json({ message: "Success" });
    // } else {
    //   res.status(401).json({ message: "Unauthorized" });
    // }
    // } else {
    //   res.status(401).json({ message: "Unauthorized" });
    // }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
