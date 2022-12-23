import type { NextPage } from "next";
import Head from "next/head";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useAuth } from "../lib/authContext";

const Home: NextPage = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  if (loading) return null;

  if (user) return <h1>U already logged</h1>;

  const auth = getAuth();

  function createUserCredentials() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("success", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
        // ..
      });
  }

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("sign with google", user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>

      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12">
      {/* Row */}
      <div className="w-full xl:w-3/4 lg:w-11/12 flex">
        {/* Col */}
        <div className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg" style={{backgroundImage: 'url("https://source.unsplash.com/Mv9hjnEUHR4/600x800")'}} />
        {/* Col */}
        <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
          <h3 className="pt-4 text-2xl text-center">Create an Account!</h3>
          <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                Nama
              </label>
              <input className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Nama" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="nim">
                NIM
              </label>
              <input className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="nim" type="number" placeholder="NIM" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                Email
              </label>
              <input className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" />
            </div>
            <div className="mb-4 md:flex md:justify-between">
              <div className="mb-4 md:mr-2 md:mb-0">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                  Password
                </label>
                <input className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border border-red-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                <p className="text-xs italic text-red-500">Please choose a password.</p>
              </div>
              <div className="md:ml-2">
                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="c_password">
                  Confirm Password
                </label>
                <input className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="c_password" type="password" placeholder="******************" />
              </div>
            </div>
            <div className="mb-6 text-center">
              <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" type="button">
                Register Account
              </button>
            </div>
            <hr className="mb-6 border-t" />
            <div className="text-center">
              <a className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="text-center">
              <a className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800" href="./index.html">
                Already have an account? Login!
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>

    </>
  );
};

export default Home;
