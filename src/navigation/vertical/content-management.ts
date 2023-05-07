import type { VerticalNavItems } from "@/@layouts/types";

export default [
  {
    title: "المتاجر",
    to: { name: "content-management-shops" },
    icon: { icon: "uil:store" },
  },
  {
    title: "الطلبات",
    to: { name: "content-management-orders" },
    icon: { icon: "tabler-baby-carriage" },
  },
  {
    title: "الزبائن",
    to: { name: "content-management-customers" },
    icon: { icon: "tabler-user-circle" },
  },
  {
    title: "الموظفين",
    to: { name: "content-management-employees" },
    icon: { icon: "tabler-user" },
  },
  {
    title: "السائقين",
    to: { name: "content-management-drivers" },
    icon: { icon: "tabler-car" },
  },
  {
    title: "كشف الحسابات",
    icon: { icon: "mdi-currency-usd" },
    children: [
      {
        title: "المطاعم",
        to: { name: "content-management-invoice-shop" },
      },
      {
        title: "السائقين",
        to: { name: "content-management-invoice-driver" },
      },
    ],
  },
  {
    title: "تقارير و إحصائيات",
    to: { name: "content-management-reports" },
    icon: { icon: "uil:analytics" },
    children: [
      { title: "تقرير عام", to: "content-management-reports-GeneralReports" },
      {
        title: "تقرير الزبائن",
        to: "content-management-reports-CustomerReports",
      },
      {
        title: "تقرير المتاجر",
        to: "content-management-reports-StoresReports",
      },
      {
        title: "تقرير الطلبيات",
        to: "content-management-reports-OrdersReports",
      },
    ],
  },
  {
    title: "الاعلانات",
    to: { name: "content-management-adverts" },
    icon: { icon: "tabler-star" },
  },
  {
    title: "شكاوي",
    to: { name: "content-management-contactUs" },
    icon: { icon: "tabler-clipboard-text" },
  },
  {
    title: "الاشعارات",
    to: { name: "content-management-notifications" },
    icon: { icon: "tabler-bell" },
  },

  {
    title: "تقييمات",
    to: { name: "content-management-ratings" },
    icon: { icon: "tabler-star" },
  },

  {
    title: " الاشتراكات",
    to: { name: "content-management-subscriptions" },
    icon: { icon: "tabler:brand-shopee" },
  },
  {
    title: " أكواد الحسم ",
    to: { name: "setting-coupons" },
    icon: { icon: "tabler:percentage" },
  },
] as VerticalNavItems;
