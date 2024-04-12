import { ProfileTabsLayout } from "~/components/profile_tabs_layout";

export default function ListingsLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className="max-h-[calc(100svh-7rem)] w-full flex">
      <ProfileTabsLayout
        tabs={[
          {
            name: "Объявления",
            href: "/profile/listings"
          },
          {
            name: "Заказы",
            href: "/profile/listings/orders"
          },
          {
            name: "Склады",
            href: "/profile/listings/warehouses"
          },
        ]}
      >
        {children}
      </ProfileTabsLayout>
    </div>
  );
}
