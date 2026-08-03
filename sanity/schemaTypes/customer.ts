import { UserIcon } from "@sanity/icons/User"
import { defineField, defineType } from "sanity"

export const customer = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "email", type: "string", validation: (r) => r.required() }),
    defineField({ name: "clerkUserId", type: "string", readOnly: true, validation: (r) => r.required() }),
    defineField({ name: "stripeCustomerId", type: "string", readOnly: true }),
    defineField({
      name: "createdAt",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { email: "email", stripeCustomerId: "stripeCustomerId" },
    prepare({ email, stripeCustomerId }) {
      return { title: email ?? "Unknown", subtitle: stripeCustomerId }
    },
  },
})