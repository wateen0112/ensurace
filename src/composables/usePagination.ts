import type { Pagination } from '@/types/app/Pagination';

export const usePagination = () => {
  const pagination = ref<Pagination>({
    totalCount: 1,
    pageIndex: 1,
    pageSize: 8,
    get totalPages() {
      return Math.ceil(this.totalCount / this.pageSize);
    },
  });

  const paginate = <T>(array: T[]): T[] => {
    pagination.value.totalCount = array.length;

    return array.slice((pagination.value.pageIndex - 1) * pagination.value.pageSize, pagination.value.pageIndex * pagination.value.pageSize);
  }

  return { pagination, paginate }
}
