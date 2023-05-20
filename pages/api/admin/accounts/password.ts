import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../../interface/response";
import admin from "../../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Unauthorized" });
        }
      })
      .catch((error) => {
        return res.status(401).json({ message: "Unauthorized" });
      });

    try {
      const { id, password } = req.body;

      await admin.auth().updateUser(id, {
        password,
      });

      res.status(200).json({ message: "Success" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
