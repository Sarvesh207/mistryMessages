import nextAuth from "next-auth";
import { authOptions } from "./options";
import NextAuth from "next-auth/next";

const handlar = NextAuth(authOptions)

export {handlar as GET, handlar as POST}