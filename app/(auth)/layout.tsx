import { buttonVariants } from "@/components/ui/button";
import SearchMessage from "@/components/web/search-message";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

const authLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Suspense fallback={null}>
        <SearchMessage />
      </Suspense>
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute top-5 left-5">
          <Link href={"/"} className={buttonVariants({ variant: "secondary" })}>
            <ArrowLeft className="size-4" />
            Go Back
          </Link>
        </div>
        <main className="w-full max-w-md mx-auto">{children}</main>
      </div>
    </>
  );
};
export default authLayout;
