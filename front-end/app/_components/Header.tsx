"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button, Image, MenuItem } from "@nextui-org/react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

function Header() {
  const { user, isSignedIn } = useUser();

  const MenuList = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About Us",
      path: "/",
    },
    {
      name: "Docs",
      path: "/",
    },
    {
      name: "Contact Us",
      path: "/",
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className="container mx-auto flex items-center justify-between"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          {/* <Image src={"logo.svg"} alt="logo" width={40} height={40} /> */}
          <h2 className="font-bold text-2xl text-primary ml-3">
            Material Tailwind
          </h2>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden sm:flex">
        {MenuList.map((item, index) => (
          <NavbarItem
            key={index}
            className="text-xl ml-10 hidden items-center gap-6 lg:flex"
          >
            <Link href={item.path}>{item.name}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end" className="flex justify-center items-center">
        <Link href="/dashboard">
          <Button color="primary">
            {isSignedIn ? "Dashboard" : "Sign in"}
          </Button>
        </Link>
        <UserButton />
      </NavbarContent>
      <NavbarMenu>
        {MenuList.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link href={item.path}>{item.name}</Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default Header;
