"use client";

import { Person } from "@/app/redux/info";
import { setEditablePerson } from "@/app/redux/person-slice";
import { RootState } from "@/app/redux/store";
import ProfileContainer from "@/containers/profile-container/index";
import { formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePage({
  params,
}: {
  params: { tab?: string[] };
}) {
  const currentTab = params.tab?.[0] || "overview";
  // redux

  return <ProfileContainer currentTab={currentTab} />;
}
