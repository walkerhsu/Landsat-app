"use client";

import ProfileContainer from "@/containers/profile-container/index";

export default function ProfilePage({
  params,
}: {
  params: { tab?: string[] };
}) {
  const currentTab = params.tab?.[0] || "overview";

  return <ProfileContainer currentTab={currentTab} />;
}
