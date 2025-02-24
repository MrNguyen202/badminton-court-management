// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenuToggle,
//   NavbarMenu,
//   NavbarMenuItem,
// } from "@nextui-org/navbar";
// import { Button, Image } from "@nextui-org/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// function Header() {
//   // const { user, isSignedIn } = useUser();
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const MenuList = [
//     { name: "Trang chủ", path: "/" },
//     { name: "Danh sách sân", path: "/dashboard" },
//     { name: "Điều khoản", path: "/policy" },
//     { name: "Dành cho chủ sân", path: "/owners" },
//   ];

//   // const handleAuthClick = () => {
//   //   if (isSignedIn) {
//   //     router.push("/profile");
//   //   } else {
//   //     router.push("/sign-in");
//   //   }
//   // };

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
//           <Image src={"/logo.png"} alt="logo" width={80} height={80} />
//         </NavbarBrand>
//       </NavbarContent>

//       <NavbarContent justify="center" className="hidden sm:flex">
//         {MenuList.map((item, index) => (
//           <NavbarItem key={index} className="text-xl ml-10">
//             <Link href={item.path}>{item.name}</Link>
//           </NavbarItem>
//         ))}
//       </NavbarContent>

//       {/* <NavbarContent justify="end" className="flex items-center gap-4">
//         {isSignedIn && (
//           <button>
//             <Image src="/bell.png" width={30} height={30} alt="Notification" />
//           </button>
//         )}

//         <Button
//           color="primary"
//           className="rounded-3xl"
//           onClick={handleAuthClick}
//         >
//           {isSignedIn ? "Cá nhân" : "Đăng nhập"}
//         </Button>
//         {isSignedIn />}
//       </NavbarContent> */}

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
import React, { useEffect, useState } from "react";
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

type User = {
  username: string;
  email: string;
};

function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUserInfo(JSON.parse(userData));
      }
    };

    loadUser(); // Load khi component mount

    // Lắng nghe khi localStorage thay đổi (do đăng nhập)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  console.log("header", userInfo);

  // Danh sách các liên kết trang
  const MenuList = [
    { name: "Trang chủ", path: "/" },
    { name: "Danh sách sân", path: "/dashboard" },
    { name: "Điều khoản", path: "/policy" },
    { name: "Dành cho chủ sân", path: "/owners" },
  ];

  // Xử lý điều hướng khi người dùng nhấn vào nút
  const handleAuthClick = () => {
    if (userInfo) {
      router.push("/profile"); // Điều hướng đến trang cá nhân nếu đã đăng nhập
    } else {
      router.push("/sign-in"); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
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

      {/* Liên kết điều hướng chính */}
      <NavbarContent justify="center" className="hidden sm:flex">
        {MenuList.map((item, index) => (
          <NavbarItem key={index} className="text-xl ml-10">
            <Link href={item.path}>{item.name}</Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Phần nút đăng nhập/đăng ký hoặc tên người dùng */}
      <NavbarContent justify="end" className="flex items-center gap-4">
        <Button color="primary" className="rounded-3xl" onClick={handleAuthClick}>
          {userInfo ? userInfo?.username : "Đăng nhập"}
        </Button>
      </NavbarContent>

      {/* Menu cho màn hình nhỏ */}
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
