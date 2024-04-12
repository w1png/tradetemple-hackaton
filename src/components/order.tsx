import { $Enums } from "@prisma/client";

export function DeliveryType({ deliveryType }: {
  deliveryType: $Enums.DeliveryType
}) {
  let className = "";
  let text = "";
  switch (deliveryType) {
    case "EXPRESS": {
      className = "bg-red-400";
      text = "Экспресс";
      break;
    }
    case "DEFAULT": {
      className = "bg-violet-400";
      text = "Обычная";
      break;
    }
  }

  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <div className={`size-2 ${className} rounded-full`}></div>
      <p>{text}</p>
    </div>
  );
}

export function OrderStatus({ status }: {
  status: $Enums.OrderStatus
}) {
  let text = "";
  let className = "";

  switch (status) {
    case "REGISTERED": {
      className = "bg-slate-100 border-slate-300";
      text = "Зарегистрирован";
      break;
    }
    case "PROCESSING": {
      className = "bg-yellow-100 border-yellow-300";
      text = "В обработке";
      break;
    }
    case "CANCELLED": {
      className = "bg-pink-100 border-pink-300";
      text = "Отменен";
      break;
    }
    case "SENT": {
      className = "bg-orange-100 border-orange-300";
      text = "Отправлен";
      break;
    }
    case "DELIVERED": {
      className = "bg-blue-100 border-blue-300";
      text = "Доставлен";
      break;
    }
    case "REJECTED": {
      className = "bg-red-100 border-red-300";
      text = "Отклонен";
      break;
    }
    case "RECEIVED": {
      className = "bg-green-100 border-green-300";
      text = "Получен";
      break;
    }
  }

  return (
    <p className={`${className} px-2 py-1 rounded-lg w-fit border-2`}>
      {text}
    </p>
  );
}
