"use client" // Add this directive at the very top

import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ModeToggle } from "./dark-toggle"
import Mybutton from "./my-button" // Assuming this is a custom button component

// Shadcn Drawer imports
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import { Menu } from "lucide-react" // For the hamburger icon

function Navbar() {
  return (
    <div className="py-4 md:px-28 px-6 flex justify-between items-center">
      <span className="text-lg font-[600]">SyntaxContest</span>

      {/* Desktop Navigation - Visible on md and larger screens */}
      <NavigationMenu className="dark:text-zinc-200 hidden md:block">
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem className="text-md">
            <NavigationMenuLink asChild>
              <Link href="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-md">
            <NavigationMenuLink asChild>
              <Link href="/discuss">Discuss</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop Actions - Visible on md and larger screens */}
      <div className="gap-2 hidden md:flex items-center">
        <ModeToggle />
        <div>
          <SignedIn>
            <UserButton /> {/* Added afterSignOutUrl for better UX */}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Mybutton variant="light">Sign In</Mybutton>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Drawer Trigger - Visible on screens smaller than md */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            {/* Using Mybutton for consistency, assuming it takes variant and size props */}
            <Mybutton variant="light">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Mybutton>
          </DrawerTrigger>
          <DrawerContent className="w-full max-w-md mx-auto rounded-t-[10px] h-[60%] flex flex-col justify-between p-4">
            {/* Drawer Header (Optional, but good for context) */}
             <DrawerHeader className="text-center">
              <DrawerTitle className="text-2xl font-bold">Menu</DrawerTitle>
              <DrawerDescription>Navigate through the application.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col items-center gap-6 pt-8">
              <span className="text-2xl font-bold">Menu</span>
              {/* Navigation Links inside Drawer */}
              <NavigationMenu>
              <NavigationMenuList className="flex flex-col space-y-6"> {/* Stack vertically */}
                <NavigationMenuItem className="text-xl">
                  <NavigationMenuLink asChild>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="text-xl">
                  <NavigationMenuLink asChild>
                    <Link href="/discuss">Discuss</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Actions inside Drawer Footer */}
            <div className="flex flex-col items-center gap-4 pb-8">
              <ModeToggle />
              <div>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Mybutton variant="light">Sign In</Mybutton>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

export default Navbar
