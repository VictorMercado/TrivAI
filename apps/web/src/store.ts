import { create } from 'zustand';
import { UserState } from "@trivai/lib/server/queries/user";
import { CREDITSPERQUESTION } from './config/constants';

export type Actions = {
  incrementScore: (pointAmount: number) => void;
  removeCheat: () => void;
  resetScore: () => void;
  deleteAccount: () => void;
  updateUserName: (name: string) => void;
  incrementCredits: () => void;
};

const initialState = {
  id: "",
  name: "",
  totalScore: 0,
  image: "",
  cheatUsed: false,
  credits: 0,
  creditsMultiplier: 1,
  creditsToAdd: CREDITSPERQUESTION,
};

export type UserStore = UserState & { creditsToAdd: number; };

export const useStore = create<UserStore & Actions>((set, get) => ({
  ...initialState,
  updateUserName: async (name) => {
    const response = await fetch("/api/updateName", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: get().id, name: name })
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    let nameResponse = await response.json().then(data => data.name);
    set({ name: nameResponse });
  },
  incrementScore: (pointAmount) => {
    const score = get().totalScore + pointAmount;
    set({ totalScore: score });
  },
  incrementCredits: () => {
    const credits = get().credits + (get().creditsToAdd * get().creditsMultiplier);
    set({ credits: credits });
  },
  removeCheat: async () => {
    const response = await fetch("/api/cheat", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: get().id, cheatUsed: get().cheatUsed })
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    set({ cheatUsed: await response.json().then(data => data.cheatUsed) });
  },
  resetScore: async () => {
    let response;
    try {
      response = await fetch("/api/resetScore", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: get().id, totalScore: 0 })
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      set({ totalScore: await response.json().then(data => data.totalScore) });
    }
    catch (e) {
      alert("Nextwork Error");
      console.log(e);
    }
  },
  deleteAccount: async () => {
    let response;
    try {
      response = await fetch(`/api/delete/${get().id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      set(initialState);
    }
    catch (e) {
      alert("Nextwork Error");
      console.log(e);
    }
  }
}));

console.log("run from store.ts"); 