"use client";
import { useState, useEffect, useRef, } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  message: string;
}
const MESSAGE_TIMEOUT = 3000;

const listeners: ((
  messages: Array<Message> | ((messages: Array<Message>) => Array<Message>),
) => void)[] = [];

const useToast = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  
  useEffect(() => {
    listeners.push(setMessages);
    return () => {
      listeners.splice(listeners.indexOf(setMessages), 1);
    }
  }, [messages]);
 
  return {
    addToast: (message: Message) => {
      listeners.forEach((setMessages) => setMessages((messages : Array<Message>) => [...messages, message]));
    },
    removeToast: (id : number) => {
      listeners.forEach((setMessages) => setMessages((messages: any) => messages.filter((message: any) => message.id !== id)));
    },
    toasts: messages,
  }
}

const Toast = ({message} : {message: Message}) => {
  const { removeToast } = useToast();
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeToast(message.id);
    }, MESSAGE_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    }
  }, [message.id, removeToast]);
  return (
    <AnimatePresence>
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-auto h-fit border border-primary p-4 text-primary bg-background"
        onClick={() => {
          removeToast(message.id);
        }}
      >
        {message.message}
      </motion.div>
    </AnimatePresence>
  );
}

const Toaster = () => {
  const { toasts } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-10 z-10 flex h-32 w-full justify-center">
      {toasts.map((message, index) => (
        <Toast
          key={index}
          message={message}
        />
      ))}
    </div>
  );
}

export { Toaster, useToast };