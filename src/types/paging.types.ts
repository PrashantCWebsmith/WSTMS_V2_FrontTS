export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface CommonPagingRequestDto {
  pageNo: number;
  pageSize: number;
  searchValue?: string;
}
