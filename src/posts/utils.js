export const defaultLimit = 5

export function createQueryString({
  search,
  sort,
  order,
  page,
  limit
}) {
  const params = new URLSearchParams()
  search && search.length > 0 ? params.set('q', search) : ''
  sort && sort.length > 0 ? params.set('sort', sort) : ''
  order && order.length > 0 ? params.set('order', order) : ''
  page > 1 ? params.set('page', page) : ''
  limit !== defaultLimit && limit >= 1 && limit <= 30 ? params.set('limit', limit) : ''

  let strParams = params.toString().length > 0 ? '?' : ''
  strParams += params.toString()
  return strParams
}

export function canGoToFirstPage(page) {
  return page !== 1
}

export function canGoToLastPage(page, pages) {
  return page !== pages
}

export function canGoToPreviousPage(page) {
  return page > 1
}

export function canGoToNextPage(page, pages) {
  return page < pages
}

export function canGoToPage(dest, page, pages) {
  return dest > 0 && dest <= pages && dest !== page
}
