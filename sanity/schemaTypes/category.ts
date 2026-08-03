import {defineField, defineType} from 'sanity'
import { TagIcon } from "@sanity/icons/Tag";
export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      description: 'Top-level shop section this category belongs to',
      options: {
        list: [
          {title: 'Clothes', value: 'clothes'},
          {title: 'Shoes', value: 'shoes'},
          {title: 'Jewelry', value: 'jewelry'},
          {title: 'Accessories', value: 'accessories'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'department', media: 'image'},
  },
})