import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
};

export const Header = ({
  label,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex items-center">
      <Image src='/assets/rdrdc.webp' alt="rdrdc-logo" width={60} height={60}/>
        <Image src='/assets/rdh.webp' alt="rdrdc-logo" width={70} height={70}/>
        </div>
      <h1 className={cn(
        "text-3xl font-semibold",
        font.className,
      )}>
       RDRDC & RDH - HRIS
      </h1>
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
};
