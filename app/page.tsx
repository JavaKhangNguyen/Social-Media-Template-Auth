"use client";
import React from "react";
import HomePage from "./Home/page";
import "./globals.css";
import {SignedIn, SignedOut, RedirectToSignIn} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="text-center flex flex-col gap-4 content-center h-screen items-center">
       <SignedIn>
        <HomePage />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
    </div>
  );
}
