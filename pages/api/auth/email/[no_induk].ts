// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../../lib/firebaseConfig/init-admin";

type Message = {
  message: string;
  email?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  // Finding User Email by no_induk
  // Use admin to query on the database
  const no_induk = req.query.no_induk;

  try {
    const user = await admin
      .firestore()
      .collection("users")
      .where("no_induk", "==", no_induk)
      .get();

    // Check if user exists
    if (user.empty) {
      res.status(404).json({ message: "User not found" });
    } else {
      // Send and end response
      res
        .status(200)
        .json({ message: "Success", email: user.docs[0].data().email });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
