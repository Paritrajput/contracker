"use client"
import dynamic from "next/dynamic";

const PeopleIssue = dynamic(() => import("@/Components/People/people-issue"), {
  ssr: false,
});

export default function Page() {
  return <PeopleIssue />;
}
