import { Suspense } from "react";
import SearchMessage from "../../components/web/search-message";

export default function HomePage() {
  return (
    <>
      <h1>Home Page</h1>
      <Suspense fallback={null}>
        <SearchMessage />
      </Suspense>
    </>
  );
}
