import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex justify-center items-center mt-20">
        <Image
          src={"/exercise-gif.gif"}
          alt="badminton"
          width={600}
          height={600}
        />
      </div>
      <div className="flex justify-center items-center order-first md:order-last mt-20">
        <SignUp />
      </div>
    </div>
  );
}