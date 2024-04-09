import NotFoundPage from "~/components/not-found";
import { getServerAuthSession } from "~/server/auth";
import EditProfile from "./edit_profile";

export default async function Profile() {
  const session = await getServerAuthSession();

  if (!session) {
    return <NotFoundPage />
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl fonb-bold mb-2">Профиль</h1>
      <div className="flex flex-row gap-2 items-center">
        <p>Имя:</p>
        <EditProfile name={session.user.name || `пользователь-${session.user.id}`} />
      </div>
      <div className="flex flex-row gap-2">
        <p>Email:</p>
        <p>{session.user.email}</p>
      </div>
    </div>
  );
}
