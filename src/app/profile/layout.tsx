import ProfileNavigation from "~/components/profile_navigation";

export default function ProfileLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <main className="container mx-auto flex flex-row gap-4 max-h-[68rem]">
      <ProfileNavigation />
      {children}
    </main>
  );
}
