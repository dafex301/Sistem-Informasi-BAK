// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../lib/firebaseConfig/init-admin";

type Message = {
  message: string;
  email?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Message>
) {
  const { nomorSurat } = req.body;

  try {
    const surat = await admin
      .firestore()
      .collection("surat")
      .where("nomor_surat", "==", nomorSurat)
      .get();

    if (surat.empty) {
      res.status(404).json({ message: "Surat tidak ditemukan" });
    } else {
      const suratData = surat.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({ message: "Surat ditemukan", ...suratData[0] });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
