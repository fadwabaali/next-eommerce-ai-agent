import { sanityFetch } from '@/sanity/lib/live'
import { ALL_CATEGORIES_QUERY } from '@/sanity/lib/queries'

export default async function Page() {
  const { data: categories } = await sanityFetch({ query: ALL_CATEGORIES_QUERY })
  return <pre>{JSON.stringify(categories, null, 2)}</pre>
}