"use client";
import { useRef } from "react";
import { useStore } from "../store"; 
import type { UserState } from "../store";


export default function StoreInitializer({user} : {user: undefined | UserState }) {
    const initialized = useRef(false);
    if (!initialized.current) {
        if (user) {
            console.log("application state initialized");
            initialized.current = true;
            useStore.setState(user);
        }
    }
    return null;
}

