// sanity/lib/queries.ts
import { defineQuery } from 'next-sanity'

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    department,
    image
  }
`)

export const PRODUCTS_BY_DEPARTMENT_QUERY = defineQuery(`
  *[_type == "product" && category->department == $department] | order(name asc) {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    images,
    featured,
    "category": category->{title, slug}
  }
`)

export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && featured == true] | order(_createdAt desc) [0...8] {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    images,
    "category": category->{title, slug}
  }
`)

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    material,
    images,
    variants,
    "category": category->{title, slug, department}
  }
`)