import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  console.log(session);

  return (
    <>
      <Navbar />
      <main>
        Тест
        Test
      </main>
    </>
  );
}
