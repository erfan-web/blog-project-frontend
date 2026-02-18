"use client";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ApiResponse, SearchPost } from "@/types/api";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

const SearchInput = () => {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchPost[] | string>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Reset on route change
  useEffect(() => {
    setTerm("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

  // Search with debounce
  useEffect(() => {
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/search?term=${term}&limit=5`, {
          method: "GET",
          signal: abortRef.current.signal,
        });
        const result: ApiResponse<SearchPost[], string> = await res.json();
        if (!result.success) {
          setResults(res.status === 401 ? result.error : []);
          return;
        }
        setResults(result.data!);
      } catch (err) {
        toast.error("Failed to fetch search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [term]);

  // Click outside close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
    if (e.key === "Enter" && activeIndex >= 0 && Array.isArray(results)) {
      router.push(`/blog/${results[activeIndex].id}`);
      setOpen(false);
      setTerm("");
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm  z-50">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        className="w-full pl-8 bg-background"
        type="search"
        value={term}
        placeholder="Search Posts..."
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {open && term.length >= 2 && (
        <div
          className="absolute top-full mt-2 rounded-md border bg-popover 
        text-popover-foreground shadow-md outline-none 
        animate-in fade-in-0 zoom-in-95"
        >
          {results && typeof results === "string" ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {results}
            </p>
          ) : loading ? (
            <div
              className="flex items-center justify-center p-4 text-sm
            text-muted-foreground"
            >
              <Loader2 className="mr-2 size-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              No results found!
            </p>
          ) : (
            <div className="py-1">
              {Array.isArray(results) &&
                results.map((post, i) => (
                  <Link
                    className={`block px-3 py-2 text-sm cursor-pointer ${
                      i === activeIndex ? "bg-accent" : "hover:bg-accent"
                    }`}
                    href={`/blog/${post.id}`}
                    key={post.id}
                    onClick={() => {
                      setOpen(false);
                      setTerm("");
                    }}
                    onMouseOver={() => setActiveIndex(-1)}
                  >
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {post.content.substring(0, 60)}
                    </p>
                  </Link>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchInput;
