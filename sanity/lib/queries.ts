// // sanity/lib/queries.ts
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

const PRODUCT_CARD_PROJECTION = `{
  _id,
  name,
  slug,
  price,
  compareAtPrice,
  images,
  "category": category->{title, slug}
}`

const DEPARTMENT_FILTER = `
  _type == "product"
  && category->department == $department
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && (count($sizes) == 0 || count(variants[size in $sizes]) > 0)
  && (count($colors) == 0 || count(variants[color in $colors]) > 0)
`

export const PRODUCTS_BY_DEPARTMENT_NEWEST_QUERY = defineQuery(`
  *[${DEPARTMENT_FILTER}] | order(_createdAt desc) [$start...$end] ${PRODUCT_CARD_PROJECTION}
`)

export const PRODUCTS_BY_DEPARTMENT_PRICE_ASC_QUERY = defineQuery(`
  *[${DEPARTMENT_FILTER}] | order(price asc) [$start...$end] ${PRODUCT_CARD_PROJECTION}
`)

export const PRODUCTS_BY_DEPARTMENT_PRICE_DESC_QUERY = defineQuery(`
  *[${DEPARTMENT_FILTER}] | order(price desc) [$start...$end] ${PRODUCT_CARD_PROJECTION}
`)

export const PRODUCTS_BY_DEPARTMENT_COUNT_QUERY = defineQuery(`
  count(*[${DEPARTMENT_FILTER}])
`)

export const DEPARTMENT_VARIANT_OPTIONS_QUERY = defineQuery(`
  *[_type == "product" && category->department == $department]{
    "sizes": variants[].size,
    "colors": variants[].color
  }
`)

export const RELATED_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && category->department == $department && _id != $excludeId] | order(_createdAt desc) [0...4] ${PRODUCT_CARD_PROJECTION}
`)

export const SEARCH_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && (name match $term + "*" || description match $term + "*")] | order(name asc) ${PRODUCT_CARD_PROJECTION}
`)