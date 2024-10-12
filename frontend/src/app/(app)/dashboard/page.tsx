import { cookies } from "next/headers";
import React from "react";

export default function HomePage() {
  const cookieStore = cookies();
  console.log(cookieStore.get("walletAddress")?.value ?? "");

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
