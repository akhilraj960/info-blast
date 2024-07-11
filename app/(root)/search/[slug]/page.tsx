"use client";

import { useParams } from "next/navigation";

export default function SearchPage() {
  const { slug } = useParams();

  return <h1>Search page</h1>;
}
