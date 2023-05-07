<script setup lang="ts">
import { useCustomerStore } from '@/stores/Customer';

const { customerDetailsDto } = storeToRefs(useCustomerStore());
const store = useCustomerStore();
const dialog = ref(false);
const dialogP = ref(false);
</script>

<template>
  <VCard class="p-2">
    <template v-slot:title>
      <VIcon icon="tabler-heart" color="primary" class="mx-1" />
      مفضلة الزبون
    </template>
    <VCardActions class="p-2">
      <VRow>
        <VCol>
          <h4 class="flex justify-center my-2">
            المتاجر المفضلة ({{ customerDetailsDto.favourite.brunchs.length }})
          </h4>
          <VCard class="mt-4">
            <VTable v-if="customerDetailsDto.favourite.brunchs.length > 0">
              <thead>
                <tr>
                  <th scope="col">اسم المتجر</th>
                  <th scope="col">صنف المتجر _ اسم الفرع</th>
                  <!-- <th scope="col">التفاصيل</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in customerDetailsDto.favourite.brunchs" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <td style="width: 7.5rem">
                    <!-- <VDialog v-model="dialog" max-width="600">
                      <template v-slot:activator="{ props }">
                        <VBtn icon color="primary" v-bind="props">
                          <VIcon icon="mdi-dots-vertical" :size="22" />
                        </VBtn>
                      </template>

                      <VCard class="p-3">
                        <template v-slot:title> تفاصيل المتاجر المفضلة </template>
                        <VCardText>
                          <VTextField
                            readonly
                            label="اسم المتجر"
                            v-model="item.name"
                            class="my-4"
                          />
                          <VTextField
                            readonly
                            label="صنف المتجر - اسم الفرع"
                            v-model="item.category"
                            class="my-4"
                          />
                        </VCardText>
                        <VCardActions>
                          <VBtn color="primary" block @click="dialog = false">Close</VBtn>
                        </VCardActions>
                      </VCard>
                    </VDialog> -->
                  </td>
                </tr>
              </tbody>
            </VTable>
            <div v-else class="p-3 flex justify-center">لا يوجد متاجر مفضلة</div>
          </VCard>
        </VCol>
        <VCol>
          <h4 class="flex justify-center my-2">
            المنتجات المفضلة ({{ customerDetailsDto.favourite.peroducts.length }})
          </h4>
          <VCard class="mt-4">
            <VTable v-if="customerDetailsDto.favourite.peroducts.length > 0">
              <thead>
                <tr>
                  <th scope="col">اسم المنتج</th>
                  <th scope="col">التصنيف</th>
                  <!-- <th scope="col">التفاصيل</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in customerDetailsDto.favourite.peroducts" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <!-- <td style="width: 7.5rem">
                    <VDialog v-model="dialogP" max-width="600">
                      <template v-slot:activator="{ props }">
                        <VBtn icon color="primary" v-bind="props">
                          <VIcon icon="mdi-dots-vertical" :size="22" />
                        </VBtn>
                      </template>

                      <VCard class="p-3">
                        <template v-slot:title> تفاصيل المنتجات المفضلة </template>
                        <VCardText>
                          <VTextField
                            readonly
                            label="اسم المنتج"
                            v-model="item.name"
                            class="my-4"
                          />
                          <VTextField
                            readonly
                            label="التصنيف"
                            v-model="item.category"
                            class="my-4"
                          />
                        </VCardText>
                        <VCardActions>
                          <VBtn color="primary" block @click="dialogP = false"
                            >Close</VBtn
                          >
                        </VCardActions>
                      </VCard>
                    </VDialog>
                  </td> -->
                </tr>
              </tbody>
            </VTable>
            <div v-else class="p-3 flex justify-center">لا يوجد منتجات مفضلة</div>
          </VCard>
        </VCol>
      </VRow>
    </VCardActions>
  </VCard>
</template>
