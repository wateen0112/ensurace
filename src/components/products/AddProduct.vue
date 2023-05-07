<script setup lang="ts">
import FileUploader from "@/components/shared/FileUploader.vue";
import Input from "@/components/input/Addrow.vue";
import { useProductStore } from "@/stores/Product";
import { useShopStore } from "@/stores/Shop";
import { useOrderStore } from "@/stores/Order";
import { Product } from "@/api/Product/dto";
import { integerValidator, requiredValidator, urlValidator } from "@validators";
import { VForm } from "vuetify/components";
import { useRoute } from "vue-router";
import type { CategoryWithProducts } from "@/api/Product/dto";
import { AddProduct } from "../../api/Product/dto";

const props = defineProps({
  productId: String,
  branchId: String,
  products: {
    type: Array as () => CategoryWithProducts[] | Product[],
    default: () => [],
  },
  categories: {
    type: Array as () => CategoryWithProducts[],
    default: () => [],
  },
});

const emit = defineEmits(["close-diaolg"]);

interface list {
  name: string;
  price: number;
}
const route = useRoute();
const store = useProductStore();
const isLoadingProd = ref(false);
const refForm = ref<InstanceType<typeof VForm>>();
const storeShop = useShopStore();
const storeOrder = useOrderStore();
const extraDto = ref<list>({
  name: "",
  price: 0,
});
const { addProductDto } = storeToRefs(useProductStore());
const storeProduct = useProductStore();
const { shopDetailsDto } = storeToRefs(useShopStore());
console.log();
function addExtraProd() {
  if (extraDto.value.name != "" && extraDto.value.price != 0) {
    addProductDto.value.productsExtraItems.unshift({
      name: extraDto.value.name,
      price: extraDto.value.price,
    });
  }
}

function removeExtraPro(id: any) {
  addProductDto.value.productsExtraItems =
    addProductDto.value.productsExtraItems.filter((ele, indx) => indx != id);
  console.log(id);
}

function submit() {
  if (refForm.value) {
    if (props.productId) {
      refForm.value.validate().then((result) => {
        if (result.valid) {
          isLoadingProd.value = true;
          storeProduct
            .ModifyProduct({
              id: props.productId,
              categoryId: addProductDto.value.categoryId,
              name: addProductDto.value.name,
              description: addProductDto.value.description,
              price: addProductDto.value.price,
              isAvailable: addProductDto.value.isAvailable,
              calories: addProductDto.value.calories,
              image: {
                otherFiles: addProductDto.value.image.otherFiles,
                defaultFile: addProductDto.value.image.defaultFile,
                deleteOther: "",
              },
              productsExtraItems:
                addProductDto.value.productsExtraItems.length > 0
                  ? addProductDto.value.productsExtraItems
                  : [],
            })
            .then(() => {
              isLoadingProd.value = false;

              // isDialogProductVisible.value = false;
              emit("close-diaolg");
              if (route.name == "content-management-shops-id") {
                storeShop.GetBranchesId(props.branchId);
                console.log("in branch route");
              } else {
                storeOrder.GetProductsForSelectedShop(props.branchId);
                console.log("in order shop route");
              }
            })
            .catch(() => (isLoadingProd.value = false));
        }
      });
    } else {
      refForm.value.validate().then((result) => {
        if (result.valid) {
          isLoadingProd.value = true;
          storeProduct
            .AddNewProduct({
              ...addProductDto.value,
              branchId: props.branchId,
              productsExtraItems:
                addProductDto.value.productsExtraItems.length > 0
                  ? addProductDto.value.productsExtraItems
                  : [],
            })
            .then((response: any) => {
              isLoadingProd.value = false;
              props.products.unshift(response.data);
              emit("close-diaolg");

              // isDialogProductVisible.value = false;
            })
            .catch(() => (isLoadingProd.value = false));
        }
      });
    }
  }
}
function resetProd() {
  props.productId = "";
  addProductDto.value = { ...new AddProduct() };
  store.lang = "ar";
}
</script>

<template>
  <VForm ref="refForm">
    <!-- {{ addProductDto }} -->
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="addProductDto.name"
          :rules="[requiredValidator]"
          label="اسم المنتج"
        />
      </VCol>

      <VCol cols="12" md="6">
        <VSelect
          v-model="addProductDto.categoryId"
          :items="categories"
          :rules="[requiredValidator]"
          item-title="name"
          item-value="id"
          label="التصنيف"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="addProductDto.calories"
          :rules="[ integerValidator]"
          label="السعرات الحرارية"
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="addProductDto.price"
          :rules="[requiredValidator, integerValidator]"
          label=" السعر"
        />
      </VCol>

      <VCol cols="12" md="6">
        <!-- {{ addProductDto.image.defaultUrl }} -->
        <label>الصورة الاساسية</label>
        <FileUploader
          v-model="addProductDto.image.defaultFile"
          v-model:url="addProductDto.image.defaultUrl"
          class="mt-5"
          :rules="[urlValidator]"
        />
      </VCol>

      <VCol cols="12" md="6">
        <span> الصور الفرعية</span>
        <FileUploader
          v-model="addProductDto.image.otherFiles"
          v-model:url="addProductDto.image.othersUrls"
          class="mt-5"
          multiple
        />
      </VCol>

      <VCol cols="12" md="6">
        <VLabel class="mb-5"> اضافة المنتج </VLabel>

        <VRow>
          <VCol cols="12" md="5">
            <VTextField v-model="extraDto.name" label=" اسم المنتج" />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField v-model="extraDto.price" label=" السعر" />
          </VCol>
          <VCol cols="12" md="2">
            <VBtn variant="text" color="success" @click="addExtraProd">
              اضافة
            </VBtn>
          </VCol>
        </VRow>

        <VRow>
          <VCol
            v-for="(prodExtra, i) in addProductDto.productsExtraItems"
            :key="i"
            cols="12"
          >
            <VCard>
              <div class="flex justify-between items-center w-full p-3">
                <strong>{{ prodExtra.name }}</strong>
                <div>
                  <span class="ml-4">{{ prodExtra.price }} ل.س</span>

                  <VBtn
                    icon
                    variant="text"
                    color="default"
                    size="x-small"
                    @click="removeExtraPro(i)"
                  >
                    <VIcon icon="mdi-close" :size="22" color="error" />
                  </VBtn>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="6">
        <textarea
          id="message"
          v-model="addProductDto.description"
          rows="4"
          class="block p-2.5 w-full text-sm text-gray-500 rounded-lg border borde-gray-300 focus:border-gray-700 focus:outline-none"
          placeholder="وصف المنتج"
        />

        <div class="mt-4">
          <VLabel>حالة المنتج</VLabel>
          <VRadioGroup v-model="addProductDto.isAvailable" class="flex" inline>
            <VRadio label="متوفر" :value="true" />
            <VRadio label="غير متوفر" :value="false" />
          </VRadioGroup>
        </div>
      </VCol>
      <div class="flex justify-end items-end w-full gap-4 mx-3 my-4">
        <VBtn variant="tonal" color="secondary" @click="resetProd">
          تهيئة
        </VBtn>

        <VBtn variant="tonal" color="secondary" @click="emit('close-diaolg')">
          اغلاق
        </VBtn>

        <VBtn :loading="isLoadingProd" @click="submit"> حفظ </VBtn>
      </div>
    </VRow>
  </VForm>
</template>
