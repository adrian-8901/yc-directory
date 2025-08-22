import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { Avatar, AvatarImage } from "./ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("google");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
