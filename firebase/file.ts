import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../lib/firebaseConfig/init";

export const uploadFile = (
  path: string,
  file: File,
  setFileUrl: React.Dispatch<React.SetStateAction<string>>
) => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFileUrl(downloadURL);
      });
    }
  );
};

export const deleteFile = (url: string) => {
  const storageRef = ref(storage, url);
  deleteObject(storageRef);
};

export const getFileName = (url: string) => {
  const storageRef = ref(storage, url);
  return storageRef.name;
};
