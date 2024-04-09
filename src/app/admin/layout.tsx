import { $Enums } from "@prisma/client";
import NotFoundPage from "~/components/not-found";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession();
  const role = await api.user.getRole();

  if (!session || role?.role !== $Enums.Role.ADMIN) {
    return <NotFoundPage />
  }

  return (
    <div className="container mx-auto p-4">
      {children}
    </div>
  );
}
