// sanity/schemaTypes/product.ts
import {defineArrayMember, defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price',
      description: 'Original price shown struck through, if on sale',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      description: 'Every size/color combination you stock, each with its own quantity',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variant',
          fields: [
            defineField({name: 'size', title: 'Size', type: 'string'}),
            defineField({name: 'color', title: 'Color', type: 'string'}),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'stock',
              title: 'Stock',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.required().integer().min(0),
            }),
          ],
          preview: {
            select: {size: 'size', color: 'color', stock: 'stock'},
            prepare({size, color, stock}) {
              return {
                title: [size, color].filter(Boolean).join(' / ') || 'Variant',
                subtitle: `Stock: ${stock ?? 0}`,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name', media: 'images.0', subtitle: 'category.title'},
  },
})