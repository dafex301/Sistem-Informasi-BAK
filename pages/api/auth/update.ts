import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../interface/response";
import admin from "../../../lib/firebaseConfig/init-admin";

interface UpdateData {
  email: string;
  name: string;
  no_induk: string;
  fakultas: string;
  jurusan: string;
  phone: string;
  role: string;
  jabatan: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    // Check the header for the tokenId firebase
    const tokenId = req.headers.authorization;
    const reqBody: UpdateData = req.body;

    // Check if token is valid
    if (tokenId) {
      // Verify token
      const decodedToken = await admin.auth().verifyIdToken(tokenId);

      // Check if the user is admin
      if (decodedToken.is_admin) {
        // Get the email from the body
        const { email } = reqBody;

        // Update data in firestore
        const userRef = await admin
          .firestore()
          .collection("users")
          .where("email", "==", email)
          .get();

        userRef.forEach((doc) => {
          if (reqBody.role === "Staff") {
            doc.ref.update({
              no_induk: reqBody.no_induk,
              name: reqBody.name,
              jabatan: reqBody.jabatan,
              phone: reqBody.phone,
              modified_at: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            doc.ref.update({
              no_induk: reqBody.no_induk,
              name: reqBody.name,
              fakultas: reqBody.fakultas,
              jurusan: reqBody.jurusan,
              phone: reqBody.phone,
              modified_at: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        });

        // Update data in firebase auth
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(user.uid, {
          displayName: reqBody.name,
          //   phoneNumber: reqBody.phone,
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
