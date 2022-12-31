// Finding User Email by no_induk

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../../lib/firebaseConfig/init-admin";
import { titleCase } from "../../../../lib/functions";

type Data = {
  message: string;
};

type Claims = {
  is_admin: boolean;
  is_staff: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    //   Check the header for the tokenId firebase
    const tokenId = req.headers.authorization;
    const { email, status } = req.body;
    if (tokenId) {
      await admin
        .auth()
        .verifyIdToken(tokenId)
        .then(async () => {
          let claims: Claims;
          if (status === "aktif") {
            claims = {
              is_admin: false,
              is_staff: true,
            };
          } else {
            claims = {
              is_admin: false,
              is_staff: false,
            };
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

            userRef.forEach((doc) => {
              doc.ref.update({ status: titleCase(status) });
            });

            res.status(200).json({ message: "Success" });
          } catch (error: any) {
            res.status(500).json({ message: error.message });
          }
        })
        .catch((error: any) => {
          console.log(error);
          res.status(500).json({ message: "Error" });
        });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
