import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Link from "next/link";
import React from "react";

const LINKS = [
  {
    title: "Company",
    items: ["About Us", "Careers", "Premium Tools", "Blog"],
  },
  {
    title: "Pages",
    items: ["Login", "Register", "Add List", "Contact"],
  },
  {
    title: "Legal",
    items: ["Terms", "Privacy", "Team", "About Us"],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="px-8 pt-24 pb-8">
      <div className="container max-w-6xl flex flex-col mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 !w-full ">
          <div className="flex col-span-2 items-center gap-10 mb-10 lg:mb-0 md:gap-36">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <p className="mb-4">{title}</p>
                {items.map((link) => (
                  <li key={link}>
                    <Link
                      href="/"
                      className="py-1 font-normal !text-gray-700 transition-colors hover:!text-gray-900"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className="">
            <p className="mb-3 text-left">Subscribe</p>
            <p className="!text-gray-500 font-normal mb-4 text-base">
              Get access to subscriber exclusive deals and be the first who gets
              informed about fresh sales.
            </p>
            <p className="font-medium mb-2 text-left">Your Email</p>
            <div className="flex mb-3 flex-col lg:flex-row items-start gap-4">
              <div className="w-full">
                {/* @ts-ignore */}
                <Input label="Email" color="gray" />
                <p className="font-medium mt-3 !text-sm !text-gray-500 text-left">
                  I agree the{" "}
                  <a
                    href="#"
                    className="font-bold underline hover:text-gray-900 transition-colors"
                  >
                    Terms and Conditions{" "}
                  </a>
                </p>
              </div>
              <Button color="primary" className="w-full lg:w-fit" size="md">
                button
              </Button>
            </div>
          </div>
        </div>
        <p className="md:text-center mt-16 font-normal !text-gray-700">
          &copy; {CURRENT_YEAR} Created by{" "}
          <a
            href="https://github.com/Bao44/badminton-court-management"
            target="_blank"
          >
            No-Code team
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;
