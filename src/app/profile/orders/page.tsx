import { OrderStatus } from "~/components/order"
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/server"
import CancelOrderButton from "./cancel"
import RejectOrderButton from "./refuse"
import AcceptOrderButton from "./accept"
import RepeatOrderButton from "./repeat"
import ReviewDialog from "./review"

export default async function OrdersPage() {
  const orders = await api.order.getOwned()

  return (
    <div className="flex flex-col w-full overflow-y-scroll h-full bg-background rounded-xl p-6 gap-4">
      {orders.map((order) => (
        <div className="w-full rounded-xl shadow hover:shadow-xl transition-all ease-in-out duration-300 bg-background flex flex-col">
          <div className="h-12 items-center bg-muted px-4 rounded-t-xl flex flex-row justify-between">
            <p className="font-semibold">Заказ от {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-xs">Оплачено <span className="text-base font-semibold">{order.products.reduce((a, b) => a + (b.amount * b.price), 0)}₽</span></p>
          </div>
          <div className="flex flex-row justify-between py-4 px-6">
            <div className="flex flex-col gap-2">
              <OrderStatus status={order.status} />
              {order.status === "RECEIVED" && (
                <ReviewDialog order={order} />
              )}
            </div>
            <div className="flex flex-row gap-2 h-full items-center">
              {order.status === "REGISTERED" && (
                <CancelOrderButton order_id={order.id} />
              )}
              {order.status === "DELIVERED" && (
                <>
                  <AcceptOrderButton order_id={order.id} />
                  <RejectOrderButton order_id={order.id} />
                </>
              )}
              {order.status === "RECEIVED" && (
                <RepeatOrderButton order_id={order.id} />
              )}
              {(order.status !== "RECEIVED" && order.status !== "DELIVERED" && order.status !== "REGISTERED") && (
                <p>{order.products.length} товаров</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
