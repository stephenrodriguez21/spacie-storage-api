export interface IPaginationOptions {
  page: number;
  limit: number;
}

interface FilterOption {
  column: string,
  value: string
}

export interface ListFilter {
  page: number,
  pageSize: number,
  filterOptions?: FilterOption[]
}
