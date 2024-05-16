import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { ModeToggle } from "@/components/theme-toggle";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
          
    <main className="flex h-full flex-col">
      <div className="mt-4 text-right mr-4">
        <ModeToggle /></div>
      <div className="space-y-6 text-center justify-center items-center flex flex-col h-screen">
        <h1 className={cn(
          "text-6xl font-semibold drop-shadow-md",
          font.className,
        )}>
        
          RD Realty Development Corporation
        </h1>
        <h1 className={cn(
          "text-6xl font-semibold drop-shadow-md",
          font.className,
        )}>
        
          RD Hardware & Fishing Supply, Inc.
        </h1>
        <p className="text-white text-lg">
          A MEMBER OF RD GROUP OF COMPANIES
        </p>
        <div>
          <LoginButton mode='modal' asChild>
            <Button variant="default" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
