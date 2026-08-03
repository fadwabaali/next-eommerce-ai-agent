import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function Pagination({
  total,
  pageSize,
  currentPage,
  buildHref,
}: {
  total: number
  pageSize: number
  currentPage: number
  buildHref: (page: number) => string
}) {
  const pageCount = Math.ceil(total / pageSize)
  if (pageCount <= 1) return null

  return (
    <PaginationRoot className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? buildHref(currentPage - 1) : undefined}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={buildHref(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={currentPage < pageCount ? buildHref(currentPage + 1) : undefined}
            className={currentPage === pageCount ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}