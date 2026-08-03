import { BasketIcon } from "@sanity/icons/Basket"
import { defineArrayMember, defineField, defineType } from "sanity"

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  groups: [
    { name: "details", title: "Order Details", default: true },
    { name: "customer", title: "Customer" },
    { name: "payment", title: "Payment" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      type: "string",
      group: "details",
      readOnly: true,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "product", type: "reference", to: [{ type: "product" }] }),
            defineField({ name: "variantSku", type: "string" }),
            defineField({ name: "size", type: "string" }),
            defineField({ name: "color", type: "string" }),
            defineField({ name: "quantity", type: "number", validation: (r) => r.required().min(1) }),
            defineField({ name: "priceAtPurchase", type: "number", validation: (r) => r.required() }),
          ],
          preview: {
            select: {
              title: "product.name",
              media: "product.images.0",
              quantity: "quantity",
              price: "priceAtPurchase",
            },
            prepare({ title, media, quantity, price }) {
              return { title: title ?? "Item", subtitle: `Qty: ${quantity} • $${price}`, media }
            },
          },
        }),
      ],
    }),
    defineField({ name: "total", type: "number", group: "details", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      group: "details",
      initialValue: "paid",
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "customer", type: "reference", to: [{ type: "customer" }], group: "customer" }),
    defineField({ name: "clerkUserId", type: "string", group: "customer", readOnly: true }),
    defineField({ name: "email", type: "string", group: "customer", readOnly: true }),
    defineField({ name: "stripeSessionId", type: "string", group: "payment", readOnly: true }),
    defineField({ name: "stripePaymentId", type: "string", group: "payment", readOnly: true }),
    defineField({
      name: "createdAt",
      type: "datetime",
      group: "details",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { orderNumber: "orderNumber", email: "email", total: "total", status: "status" },
    prepare({ orderNumber, email, total, status }) {
      return {
        title: `Order ${orderNumber ?? "N/A"}`,
        subtitle: `${email ?? ""} • $${total ?? 0} • ${status ?? "paid"}`,
      }
    },
  },
  orderings: [{ title: "Newest First", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] }],
})