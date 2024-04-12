"use client"

import React, { useState } from "react";
import { FaClipboardList, FaTruck } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

function InstructionsPage() {

}

enum Pages {
  Orders = "orders",
  Listings = "listings",
  Warehouses = "warehouses",
  None = "",
}

function InstructionButton({ title, icon, setValue }: {
  title: string,
  icon: React.ReactNode,
  setValue: () => void
}) {
  return (
    <div onClick={setValue} className="w-full select-none h-24 shadow-md hover:shadow-xl transition-all ease-in-out duration-300 bg-background rounded-xl flex flex-row items-center justify-center gap-2">
      {icon}
      <p className="text-3xl text-center">{title}</p>
    </div>
  )
}

function OrdersPage() {
  return (
    <>
      <p className="text-4xl font-semibold">Заказы</p>
      <p className="whitespace-pre">
        1. Выберите товары на главной и добавьте в корзину<br />
        2. Перейдите в корзину и нажмите оформить заказ<br />
        3. Выберите пункт выдачи и тип доставки<br />
        4. Нажмите кнопку оформить
      </p>
    </>
  );
}

function ListingsPage() {
  return (
    <>
      <p className="text-4xl font-semibold">Товары</p>
      <p className="whitespace-pre">
        1.  Перейдите в профиль в раздел продажи<br />
        2. Нажмите кнопку “Создать обьявление”<br />
        3. Заполните все пункты в модальном окне<br />
        4. Нажмите кнопку “Сохранить”
      </p>
    </>
  );
}

function WarehousesPage() {
  return (
    <>
      <p className="text-4xl font-semibold">Склады</p>
      <p className="whitespace-pre">
        1.  Перейдите в профиль в раздел продажи
        2. Нажмите кнопку “Создать склад”<br />
        3. Заполните все пункты в модальном окне<br />
        4. Нажмите кнопку “Сохранить”<br />
      </p>
    </>
  );
}

export default function Instructions() {
  const [selectedPage, setSelectedPage] = useState<Pages>(Pages.Orders);

  return (
    <div className="container mx-auto px-2 flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-3 p-6 rounded-xl bg-background">
        <InstructionButton
          title="Заказы"
          icon={<FaClipboardList className="size-6" />}
          setValue={() => setSelectedPage(Pages.Orders)}
        />
        <InstructionButton
          title="Товары"
          icon={<FaTruck className="size-6" />}
          setValue={() => setSelectedPage(Pages.Listings)}
        />
        <InstructionButton
          title="Склады"
          icon={<FaHouse className="size-6" />}
          setValue={() => setSelectedPage(Pages.Warehouses)}
        />
      </div>
      <div className="p-6 bg-background rounded-xl h-full flex flex-col gap-4">
        {selectedPage === Pages.Orders && <OrdersPage />}
        {selectedPage === Pages.Listings && <ListingsPage />}
        {selectedPage === Pages.Warehouses && <WarehousesPage />}
      </div>

    </div>
  );
}
