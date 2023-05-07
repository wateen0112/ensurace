<script setup lang="ts">
import { storeToRefs } from "pinia";
import FileUploader from "@/components/shared/FileUploader.vue";
import { useBranchCategoriesStore } from "@/stores/BranchesCategories";
import { useShopStore } from "@/stores/Shop";
import { useProductStore } from "@/stores/Product";
import { useOrderStore } from "@/stores/Order";
import AddProduct from "@/components/products/AddProduct.vue";
import { AddProduct as AddProductDTO } from "@/api/Product/dto";
import { useRoute } from "vue-router";
import { useFile } from "@/composables/index";
import type { CategoryWithProducts, Product } from "@/api/Product/dto";
import LangSwitcher from "@/components/shared/LangSwitcher.vue";

const props = defineProps({
  categoryList: {
    type: Array as () => CategoryWithProducts[],
    default: () => [],
  },
  cartList: {
    type: Array,
    default: () => [],
  },
  hideMenu: Boolean,
  isOrder: {
    type: Boolean,
    default: true,
  },
  branchId: {
    type: String,
    default: () => "",
  },
});

const emit = defineEmits(["addProductToCart"]);
const route = useRoute();
const { addProductDto, lang } = storeToRefs(useProductStore());
const storeProduct = useProductStore();
const storeShop = useShopStore();
const storeOrder = useOrderStore();
const isLoading = ref(false);
const isLoadingProd = ref(false);
const selectedCategory = ref<null | number>(null);
const { getFileUrl } = useFile();
const store = useBranchCategoriesStore();
const isDialogProductVisible = ref(false);
const model = ref(null);
const categorySearch = ref("");
const productSearch = ref("");
const categoryId = ref("");
const productId = ref("");
const isDialogVisible = ref(false);
const { addBranchCategoryDto } = storeToRefs(useBranchCategoriesStore());
const { shopDetailsDto } = storeToRefs(useShopStore());

function selectProduct(product: Product) {
  emit("addProductToCart", product);
}
const products = computed(() =>
  selectedCategory.value !== null
    ? props.categoryList[selectedCategory.value].products
    : []
);

const filterList = computed(() =>
  props.categoryList.filter(
    (ele: CategoryWithProducts) =>
      ele.name.includes(categorySearch.value) || !categorySearch.value
  )
);
const filteredProducts = computed(() =>
  products.value.filter(
    (ele: Product) =>
      ele.name.includes(productSearch.value) || !productSearch.value
  )
);

// const filteredProducts = computed(() =>
//   products.value.filter(
//     (ele: Product) =>
//       !productSearch.value ||
//       (products.value.length > 0 && ele.name == productSearch.value)
//   )
// );

// products

function delProduct(id: string) {
  console.log(id);

  storeProduct.DeleteProduct(id);
  // .then(() => {
  //   products.value = products.value.filter((ele) => ele.id != id);
  //   console.log(products.value);
  // });
}

function detailProduct(id: string) {
  productId.value = id;
  storeProduct.GetIdProduct(id).then(() => {
    isDialogProductVisible.value = true;
  });
}

// categories

function setSelectedCategory(idx: number, id: string) {
  selectedCategory.value = idx;
  addProductDto.value.categoryId = id;
}

function delCategory(id: string) {
  store.DeleteBarnchCategories(id).then(() => {
    if (route.name == "ontent-management-shops-id") {
      shopDetailsDto.value.branch.categories =
        shopDetailsDto.value.branch.categories.filter(
          (ele: any) => ele.id !== id
        );
      products.value = [];
    } else {
      storeOrder.GetProductsForSelectedShop(props.branchId);
      products.value = [];
    }
  });
}

function detailCategory(item: CategoryWithProducts) {
  // console.log(item);
  categoryId.value = item.id;
  isDialogVisible.value = true;
  addBranchCategoryDto.value.name = item.name;
  addBranchCategoryDto.value.imageUrl = item.imageUrl;
}

function ModifyAddCategory() {
  console.log(categoryId.value);

  if (categoryId.value) {
    console.log("in Modfy");
    isLoading.value = true;
    store
      .ModifyBarnchCategories({
        id: categoryId.value,
        imageFile: addBranchCategoryDto.value.imageFile,
        name: addBranchCategoryDto.value.name,
      })
      .then(() => {
        isLoading.value = false;
        isDialogVisible.value = false;
        if (route.name == "content-management-shops-id")
          storeShop.GetBranchesId(route.params.id);
        else storeOrder.GetProductsForSelectedShop(props.branchId);
        addBranchCategoryDto.value.name = "";
        addBranchCategoryDto.value.imageUrl = "";
        categoryId.value = "";
      })
      .catch(() => (isLoading.value = false));
  } else {
    console.log("in add cate");

    isLoading.value = true;
    store
      .AddBarnchCategories({
        ...addBranchCategoryDto.value,
        branchId: props.branchId,
      })
      .then((response: any) => {
        props.categoryList.unshift(response.data);
        isLoading.value = false;
        isDialogVisible.value = false;
        addBranchCategoryDto.value.name = "";
        addBranchCategoryDto.value.imageFile = null;
      })
      .catch(() => (isLoading.value = false));
  }
}
watch(lang, () => {
  storeProduct.GetIdProduct(productId.value);
});
</script>

<template>
  <div>
    <!-- categories -->
    <VRow>
      <VCol cols="12">
        <VCard class="p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-between">
              <VLabel class="mb-2"> الاصناف </VLabel>
              <LangSwitcher v-model="storeShop.lang" class="mx-5" />
            </div>

            <div class="flex items-center justify-between gap-4 w-1/2">
              <VTextField
                v-model="categorySearch"
                prepend-inner-icon="mdi-search"
                placeholder="ابحث بصنف المتجر"
              />
              <VDialog v-model="isDialogVisible" max-width="600">
                <template #activator="{ props }">
                  <VBtn v-bind="props"> إضافة صنف </VBtn>
                </template>

                <!-- Dialog close btn -->
                <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

                <!-- Dialog Content -->
                <VCard :title="categoryId ? 'تعديل صنف' : 'اضافة صنف'">
                  <VCardText>
                    <VRow>
                      <VCol cols="12">
                        <label for="order">الاسم الصنف</label>
                      </VCol>
                      <VCol cols="12">
                        <VTextField v-model="addBranchCategoryDto.name" />
                      </VCol>
                      <VCol cols="12">
                        <label for="order">ايقونة الصنف</label>
                      </VCol>
                      <VCol cols="12">
                        <FileUploader
                          v-model:url="addBranchCategoryDto.imageUrl"
                          v-model="addBranchCategoryDto.imageFile"
                        />
                      </VCol>
                    </VRow>
                  </VCardText>

                  <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn
                      variant="tonal"
                      color="secondary"
                      @click="isDialogVisible = false"
                    >
                      Close
                    </VBtn>
                    <VBtn :loading="isLoading" @click="ModifyAddCategory">
                      Save
                    </VBtn>
                  </VCardText>
                </VCard>
              </VDialog>
            </div>
          </div>
          <VSheet
            v-if="filterList.length"
            class="mx-auto mt-3"
            max-width="1200"
          >
            <VSlideGroup v-model="model" class="pa-4">
              <VSlideGroupItem
                v-for="(category, i) in filterList"
                :key="category.id"
                v-slot="{ selectedClass }"
              >
                <!-- {{ category.id }} -->
                <VCard
                  color="grey-lighten-1"
                  :class="[
                    selectedClass,
                    {
                      'shadow-md ring-2 ring-main shadow-main':
                        i === selectedCategory,
                    },
                  ]"
                  class="relative mx-3 my-4 rounded-xl"
                  height="240"
                  width="190"
                  @click="setSelectedCategory(i, category.id)"
                >
                  <VMenu v-if="!hideMenu">
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        class="absolute z-50 top-2 left-2"
                        icon
                        variant="flat"
                        color="primary"
                        size="x-small"
                      >
                        <VIcon icon="mdi-dots-vertical" :size="22" />
                      </VBtn>
                    </template>

                    <VList>
                      <VListItem @click="delCategory(category.id)">
                        <VListItemTitle>حذف تصنيف</VListItemTitle>
                      </VListItem>
                      <VListItem @click="detailCategory(category)">
                        <VListItemTitle>تفصيل تصنيف</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>

                  <img
                    :src="getFileUrl(category.imageUrl)"
                    class="w-full h-40 object-cover"
                  />

                  <h4 class="mt-2 flex justify-center items-center">
                    {{ category.name }}
                  </h4>
                </VCard>
              </VSlideGroupItem>
            </VSlideGroup>
          </VSheet>
          <div v-else class="flex justify-center items-center w-full">
            <h3>لايوجد بيانات</h3>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- products -->
    <VRow>
      <VCol cols="12">
        <VCard class="p-5">
          <div class="flex items-center justify-between">
            <VLabel class="mb-2"> المنتجات </VLabel>
            <div class="flex items-center justify-between gap-4 w-1/2">
              <VTextField
                v-model="productSearch"
                prepend-inner-icon="mdi-search"
                placeholder="ابحث بالمنتجات"
              />
              <VDialog v-model="isDialogProductVisible" max-width="800">
                <template #activator="{ props }">
                  <VBtn v-bind="props" :disabled="selectedCategory === null">
                    إضافة منتج
                  </VBtn>
                </template>

                <DialogCloseBtn
                  @click="isDialogProductVisible = !isDialogProductVisible"
                />
                <VCard
                  :title="productId ? 'تعديل المنتج' : 'اضافة منتج'"
                  class="relative"
                >
                  <LangSwitcher
                    v-if="productId"
                    v-model="storeProduct.lang"
                    class="mx-3"
                  />
                  <VCardText>
                    <AddProduct
                      :products="products"
                      :product-id="productId"
                      :branch-id="branchId"
                      :categories="props.categoryList"
                      @close-diaolg="isDialogProductVisible = false"
                    />
                  </VCardText>
                  <!--
 <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn variant="tonal" color="secondary" @click="resetForm">
                      Reset
                    </VBtn>
                    <VBtn
                      variant="tonal"
                      color="secondary"
                      @click="isDialogProductVisible = false"
                    >
                      Close
                    </VBtn>
                    <VBtn :loading="isLoading" @click="addModifyProduct">
                      Save
                    </VBtn>
                  </VCardText> 
-->
                </VCard>
              </VDialog>
            </div>
          </div>
          <div
            class="flex justify-center items-center w-full"
            v-if="selectedCategory === null"
          >
            <h3 class="mt-5">اختر صنف معين لرؤية منتجه</h3>
          </div>
          <div
            class="flex justify-center items-center w-full"
            v-if="selectedCategory !== null && filteredProducts.length === 0"
          >
            <h3 class="mt-5">لا يوجد صنف لهذا المنتج</h3>
          </div>
          <!--  -->
          <div
            :class="
              route.name == 'content-management-shops-id'
                ? 'flex flex-wrap justify-start items-center w-full mt-4 gap-5'
                : 'grid grid-cols-3 w-full mt-4 gap-5'
            "
          >
            <template
              v-if="selectedCategory !== null && filteredProducts.length"
            >
              <VCard
                v-for="product in filteredProducts"
                :key="product.id"
                :elevation="2"
                class="relative w-48 rounded-xl h-60 flex justify-start items-center flex-col"
              >
                <VMenu>
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      class="absolute z-50 top-2 left-2"
                      icon
                      variant="flat"
                      color="primary"
                      size="x-small"
                    >
                      <VIcon icon="mdi-dots-vertical" :size="22" />
                    </VBtn>
                  </template>

                  <VList>
                    <VListItem @click="delProduct(product.id)">
                      <VListItemTitle>حذف منتج</VListItemTitle>
                    </VListItem>
                    <VListItem @click="detailProduct(product.id)">
                      <VListItemTitle>تفصيل منتج</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
                <VBadge
                  :color="product.isAvailable ? 'success' : 'error'"
                  class="absolute right-6 top-5"
                />
                <img
                  :src="getFileUrl(product.imageUrl)"
                  class="w-full h-40 object-cover"
                />
                <div class="px-3 py-2">
                  <h4>
                    {{ product.name }}
                  </h4>
                  <span class="text-primary">{{ product.price }} ل.س</span>
                </div>
                <div
                  v-if="isOrder"
                  class="absolute opacity-0 transition-all z-10 top-0 left-0 backdrop:blur-md backdrop-blur rounded-xl bg-white dark:bg-black dark:bg-opacity-40 flex items-center justify-center h-full w-full bg-opacity-50 hover:opacity-100"
                >
                  <VBtn
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-cart"
                    @click="selectProduct(product)"
                  >
                    إضافة للسلة
                  </VBtn>
                </div>
              </VCard>
            </template>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
