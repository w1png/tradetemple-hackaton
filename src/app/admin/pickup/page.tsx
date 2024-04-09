import { api } from "~/trpc/server";
import CreatePickupPoint from "./add_pickup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";
import DeleteDialog from "./delete";

export default async function PickupPoints() {
  const pickupPoints = await api.pickupPoint.getAll();

  return (
    <div className="container mx-auto space-y-8 h-[calc(100svh-8rem)] bg-white rounded-xl p-4">
      <h1 className="text-2xl font-bold mb-2">Пункты выдачи</h1>
      <CreatePickupPoint />
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Адрес</TableHead>
            <TableHead>Расписание</TableHead>
            <TableHead className="w-fit">Действие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pickupPoints.map((pickupPoint) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{pickupPoint.adress}</TableCell>
                <TableCell>{pickupPoint.schedule}</TableCell>
                <TableCell>
                  <DeleteDialog pickupPoint={pickupPoint} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
