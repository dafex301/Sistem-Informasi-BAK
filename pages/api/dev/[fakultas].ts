import type { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";
import { ResponseData } from "../../../interface/response";
import admin from "../../../lib/firebaseConfig/init-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const kodeFakultas = req.query.fakultas as string;

  if (req.method === "GET") {
    const jurusan = await admin
      .firestore()
      .collection("fakultas")
      .doc(kodeFakultas)
      .collection("jurusan")
      .get();

    const data = jurusan.docs.map((doc) => {
      const { nama } = doc.data();
      return { nama };
    });

    res.status(200).json({ message: "Success", data });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
