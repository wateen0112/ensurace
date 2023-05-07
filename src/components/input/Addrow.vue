<script setup lang="ts">
const rows = ref([["", ""]]);

const ids = ref<Array<string>>([]);
const rowsCount = computed(() => rows.value.length);
const colsCount = computed(() => rows.value[0].length);

const appendRow = () => {
  const newCol = [];
  for (let i = 0; i < colsCount.value; i++) {
    newCol.push("");
  }
  rows.value.push(newCol);
};

const props = defineProps(["modelValue", "readonly"]);

const emit = defineEmits(["update:modelValue"]);

const deleteProduct = () => {
  const newCol = [];
  rows.value.pop(newCol);
};

onMounted(() => {
  rows.value = props.modelValue;
});

watch(
  props.modelValue,
  (nv: string[][]) => {
    rows.value = nv;
  },
  { deep: true }
);
</script>
<template>
  <div class="tw-mb-4">
    <div>
      <VBtn @click="appendRow" size="x-small" icon class="bg-primary mt-4">
        <VIcon style="color: #eee"> mdi-plus </VIcon>
      </VBtn>
      <VBtn
        @click="deleteProduct"
        size="x-small"
        icon="mdi-trash"
        class="bg-primary mt-4 mr-4"
      >
      </VBtn>
    </div>
    <div>
      <div v-for="(row, i) in rows" :key="i" class="my-2 tw-ml-12">
        <div
          :style="{
            display: 'grid',
  gridTemplateColumns: `repeat(3 , 1fr)`,
          }"
          class="tw-gap-3"
        >
          <VTextField
            class="tw-min-w-[150px]"
            :class="{ 'tw-bg-primary tw-bg-opacity-30': i === 0 }"
            v-for="(col, j) in row"
            v-model="rows[i][j]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
