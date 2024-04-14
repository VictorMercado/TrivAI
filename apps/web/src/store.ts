import { create } from 'zustand';
import { UserState } from "@trivai/lib/server/queries/user";

export type Actions = {
  incrementScore: (pointAmount: number) => void;
  removeCheat: () => void;
  resetScore: () => void;
  deleteAccount: () => void;
  updateUserName: (name: string) => void;
};

const initialState: UserState = {
  id: "",
  name: "",
  totalScore: 0,
  image: "",
  cheatUsed: false,
};

export const useStore = create<UserState & Actions>((set, get) => ({
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
  incrementScore: async (pointAmount) => {
    const response = await fetch("/api/score", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: get().id, totalScore: get().totalScore + pointAmount })
    });
    if (!response.ok) {

      throw new Error(response.statusText);
    }
    let score = await response.json().then(data => data.totalScore);
    set({ totalScore: score });
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