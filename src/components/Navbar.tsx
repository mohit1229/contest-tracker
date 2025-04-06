import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link" // or "next/link" if you're using Next.js
import { ModeToggle } from "./dark-toggle"
import { Button } from "./ui/button"
function Navbar() {
  return (
    <div className="p-4 shadow-md shadow-zinc-800 flex justify-between items-center">
        <span className="text-lg font-bold">SyntaxContest</span>

      <NavigationMenu>
        
        <NavigationMenuList className="">
          <NavigationMenuItem className="text-md">
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/discuss">Discuss</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="gap-2 flex">
      <ModeToggle />
<div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button >
          <SignInButton mode="modal" />
          </Button>
        </SignedOut>
        </div>
      </div>

    </div>
  )
}

export default Navbar
