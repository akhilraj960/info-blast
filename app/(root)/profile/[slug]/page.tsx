'use client'

import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { slug } = useParams();

  return <h1>Profile page {slug}</h1>;
}
