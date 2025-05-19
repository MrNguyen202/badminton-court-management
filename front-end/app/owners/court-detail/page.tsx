import React, { Suspense } from "react";
import CourtDetail from "./_components/CourtDetail";

export default function page() {
  return (
    <Suspense fallback="Loading...">
      <CourtDetail />
    </Suspense>
  );
}
