import { atom } from "recoil";

export const receiver = atom({
  key: "receiver",
  default: {
    email: "",
    id: 0,
    username: "",
    createdAt: "",
  },
});
