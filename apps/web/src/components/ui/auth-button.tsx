"use client";

import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";

const SignInButton = () => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="coolBorder flex w-full items-center justify-center p-2 text-sm"
      onClick={() => {
        signIn();
      }}
    >
      {" "}
      <span className="coolText"> SIGN IN </span>
    </motion.button>
  );
}

const SignOutButton = () => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="coolBorder flex w-full items-center justify-center p-2 text-sm"
      onClick={() => {
        signOut();
      }}
    >
      {" "}
      <span className="coolText"> SIGN OUT </span>
    </motion.button>
  );
}

const AuthButton = () => {
  const { data: session } = useSession();
  if (!session) {
    return <SignInButton />;
  }
  return <SignOutButton />;
};

export { AuthButton };