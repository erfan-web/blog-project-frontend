// app/home/search-message.tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SearchMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast(message);
      router.replace(pathname);
    }
  }, [searchParams]);

  return null; // فقط toast، چیزی رندر نمی‌کند
}
