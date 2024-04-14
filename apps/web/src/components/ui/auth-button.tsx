"use client";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@ui/button";

const SignInButton = () => {
  return (
    <motion.span
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {" "}
      <Button
        className="w-full"
        variant="special"
        size="default"
        onClick={() => {
          signIn();
        }}
      >
        SIGN IN
      </Button>
    </motion.span>
  );
}

const SignOutButton = () => {
  return (
    <motion.span
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {" "}
      <Button
        className="w-full"
        variant="special"
        size="default"
        onClick={() => {
          signOut();
        }}
      >
        SIGN OUT
      </Button>
    </motion.span>
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