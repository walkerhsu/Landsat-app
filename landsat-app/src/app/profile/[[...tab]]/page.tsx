import ProfileComponent from '@/components/profile-component/index';

export default function ProfilePage({ 
  params 
}: { 
  params: { tab?: string[] } 
}) {
  const currentTab = params.tab?.[0] || 'overview';
  
  return <ProfileComponent currentTab={currentTab} />;
}
