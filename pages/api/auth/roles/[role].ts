import admin from "../../../../lib/firebaseConfig/init-admin";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { titleCase } from "../../../../lib/functions";

// Generate new claims role based on the url path, using post method
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Only POST
  if (req.method === "POST") {
    const role = req.query.role;
    const { email } = req.body;
    let claims;
    if (role === "Admin") {
      claims = {
        is_admin: true,
        is_staff: true,
      };
    } else if (role === "Staff") {
      claims = {
        is_admin: false,
        is_staff: true,
      };
    } else if (role === "Mahasiswa") {
      claims = {
        is_admin: false,
        is_staff: false,
      };
    } else {
      res.status(400).json({ message: "Bad Request" });
      return;
    }

    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, claims);

      // Get firestore where email is equal to email
      const userRef = await admin
        .firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      // Update the role in firestore
      userRef.forEach((doc) => {
        doc.ref.update({ role: titleCase(role) });
      });

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
