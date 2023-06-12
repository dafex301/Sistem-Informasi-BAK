import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseData } from "../../../interface/response";
import admin from "../../../lib/firebaseConfig/init-admin";

import fakultas from "../../../data/fakultas.json";
import jurusan from "../../../data/jurusan.json";

const data = {
  fakultas,
  jurusan,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    data.fakultas.forEach((fakultas) => {
      const { kode, nama } = fakultas;
      admin.firestore().collection("fakultas").doc(kode).set({ nama });

      data.jurusan
        .filter((jurusan) => jurusan.fakultas === nama)
        .forEach((jurusan) => {
          const { nama } = jurusan;
          admin
            .firestore()
            .collection("fakultas")
            .doc(kode)
            .collection("jurusan")
            .doc()
            .set({ nama });
        });
    });
    res.status(200).json({ message: "Success", data: jurusan });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
