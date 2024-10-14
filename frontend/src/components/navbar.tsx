import NavInner from "./nav-inner";
import { cookies } from "next/headers";

export function Navbar() {
  const cookieStore = cookies();
  const auth = cookieStore.get("walletAddress")?.value ?? "";

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <NavInner isAuth={auth !== ""} />
    </header>
  );
}
