// Finding User Email by no_induk

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../lib/firebaseConfig/init-admin";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    //   Check the header for the tokenId firebase
    const tokenId = req.headers.authorization;

    // Check if token is valid
    if (tokenId) {
      await admin
        .auth()
        .verifyIdToken(tokenId)
        .then((decodedToken: { uid: any }) => {
          const uid = decodedToken.uid;
          // console.log(uid);
          // Send and end response
          res.status(200).json({ message: uid });
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
