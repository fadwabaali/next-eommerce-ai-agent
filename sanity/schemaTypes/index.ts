import type { SchemaTypeDefinition } from 'sanity'
import { category } from './category'
import { product } from './product'
import { order } from './order'
import { customer } from './customer'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, order, customer],
}