// "use client";
// import React, { useState } from "react";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenuToggle,
//   NavbarMenu,
//   NavbarMenuItem,
// } from "@nextui-org/navbar";
// import { Button, Image, MenuItem } from "@nextui-org/react";
// import Link from "next/link";
// import { UserButton, useUser } from "@clerk/nextjs";

// function Header() {
//   const { user, isSignedIn } = useUser();

//   const MenuList = [
//     {
//       name: "Trang chủ",
//       path: "/",
//     },
//     {
//       name: "Danh sách sân",
//       path: "/dashboard",
//     },
//     {
//       name: "Điều khoản",
//       path: "/policy",
//     },
//     {
//       name: "Dành cho chủ sân",
//       path: "/owners",
//     },
//   ];

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <Navbar
//       maxWidth="full"
//       onMenuOpenChange={setIsMenuOpen}
//       className="container mx-auto flex items-center justify-between"
//     >
//       <NavbarContent>
//         <NavbarMenuToggle
//           aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//           className="sm:hidden"
//         />
//         <NavbarBrand>
//           <Image src={"logo.png"} alt="logo" width={80} height={80} />
//           {/* <h2 className="font-bold text-2xl text-primary ml-3">
//             Material Tailwind
//           </h2> */}
//         </NavbarBrand>
//       </NavbarContent>
//       <NavbarContent justify="center" className="hidden sm:flex">
//         {MenuList.map((item, index) => (
//           <NavbarItem
//             key={index}
//             className="text-xl ml-10 hidden items-center gap-6 lg:flex"
//           >
//             <Link href={item.path}>{item.name}</Link>
//           </NavbarItem>
//         ))}
//       </NavbarContent>
//       <NavbarContent justify="end" className="flex justify-center items-center">
//         <Link href="/dashboard">
//           <Button color="primary" className="rounded-3xl">
//             {isSignedIn ? "Cá nhân" : "Đăng nhập"}
//           </Button>
//         </Link>
//         <UserButton />
//       </NavbarContent>
//       <NavbarMenu>
//         {MenuList.map((item, index) => (
//           <NavbarMenuItem key={index}>
//             <Link href={item.path}>{item.name}</Link>
//           </NavbarMenuItem>
//         ))}
//       </NavbarMenu>
//     </Navbar>
//   );
// }

// export default Header;

"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button, Image } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuList = [
    { name: "Trang chủ", path: "/" },
    { name: "Danh sách sân", path: "/dashboard" },
    { name: "Điều khoản", path: "/policy" },
    { name: "Dành cho chủ sân", path: "/owners" },
  ];

  const handleAuthClick = () => {
    if (isSignedIn) {
      router.push("/profile");
    } else {
      router.push("/sign-in");
    }
  };

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
          <Image src={"/logo.png"} alt="logo" width={80} height={80} />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="center" className="hidden sm:flex">
        {MenuList.map((item, index) => (
          <NavbarItem key={index} className="text-xl ml-10">
            <Link href={item.path}>{item.name}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="flex items-center gap-4">
        <Button
          color="primary"
          className="rounded-3xl"
          onClick={handleAuthClick}
        >
          {isSignedIn ? "Cá nhân" : "Đăng nhập"}
        </Button>
        {isSignedIn && <UserButton />}
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
