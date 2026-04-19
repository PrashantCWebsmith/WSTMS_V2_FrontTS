export interface PagedResultModel<T> {
  data: T[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface PagingParamsModel {
  page: number;
  size: number;
  search?: string;
}
