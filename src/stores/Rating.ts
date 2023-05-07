import { defineStore } from 'pinia';
import { RatingApi } from '@/api/Rating/endpoints';
import type { GetRatings, Customers } from '@/api/Rating/dto';
import { GetIdRating, UpsertBranchEvaluation as BranchEvaluation } from '@/api/Rating/dto';
import { useApi, usePagination } from '@/composables/index';

export const useRatingStore = defineStore('Rating', () => {
  const { GET, POST, DELETE } = useApi();
  const { pagination } = usePagination();
  const AllRatings = ref<Customers[]>([]);
  const ratings = ref<Customers[]>([]);
  const filterRate = ref({
    endDate: '',
    startDate: '',
  });
  const ratingDetailDto = ref<GetIdRating>(new GetIdRating());
  const ratingDto = ref<BranchEvaluation>(new BranchEvaluation());
  const SearchRating = ref('')

  // Get Rating
  async function GetAllRatings() {
    try {
      const res = await GET<GetRatings>(RatingApi.GetAll, {
        ...filterRate.value,
        ...pagination.value,
      });
      console.log(res.data);
      ratings.value = res.data.orders;
      AllRatings.value = res.data.orders;
      pagination.value.totalCount = res.data.count;
    }
 catch (error) {
      console.log(error);
    }
  }

  // Get by id Rating
  async function GetByIdRating(id: any) {
    try {
      const res = await GET<GetIdRating>(RatingApi.GetById, { id });
      ratingDetailDto.value = { ...res.data };
    }
 catch (error) {
      console.log(error);
    }
  }

  // upsert Rating
  async function UpsertBranchEvaluation(payload: any) {
    try {
      const res = await POST(
        RatingApi.UpsertBranchEvaluation,
        payload,
        { success: 'تم حفظ التقييم الفرع' },
        { formData: true },
      );
      GetByIdRating(payload.id);
    }
 catch (error) {
      console.log(error);
    }
  }

  // upsert Rating
  async function UpsertDriverEvaluation(payload: any) {
    try {
      const res = await POST(
        RatingApi.UpsertDriverEvaluation,
        payload,
        { success: 'تم حفظ التقييم السائق' },
        { formData: true },
      );
      GetByIdRating(payload.id);
    }
 catch (error) {
      console.log(error);
    }
  }

  // Delete driver
  async function DeleteDriver(id: any) {
    try {
      await DELETE(RatingApi.DeleteDriver, null, { orderId: id });
      GetByIdRating(id);
    }
 catch (error) {
      console.log(error);
    }
  }

  // Delete branch
  async function DeleteBranch(id: any, branchId: string[]) {
    try {
      await DELETE(RatingApi.DeleteBranch, {
        orderId: id,
        branchIds: branchId,
      });
      GetByIdRating(id);
    }
 catch (error) {
      console.log(error);
    }
  }

  const search = () => {
    ratings.value = ratings.value.filter((el: any) => {
      return el.customerName
        .toLowerCase()
        .includes(SearchRating.value.toLocaleLowerCase());
    });
  };
  const filter = () => {
    ratings.value = AllRatings.value;
    if (SearchRating.value !== '')
    
      search();
  };

  watch(SearchRating, () => {
    filter();
  });

  return {
    GetAllRatings,
    ratings,
    pagination,
    DeleteBranch,
    DeleteDriver,
    UpsertBranchEvaluation,
    UpsertDriverEvaluation,
    ratingDetailDto,
    ratingDto,
    GetByIdRating,
    filterRate,
    SearchRating,
    AllRatings,
  };
})
