<script lang="ts" setup>
import { useAppStore } from '@/stores/App';

const props = defineProps({
  hasSearch: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: 'ابحث في الصفحة',
  },
  qury: {
    type: String,
  },
  add: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: 'إضافة',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  dialogTitle: {
    type: String,
    default: 'Dialog Title',
  },
  subTitle: {
    type: String,
    default: 'SubTitle',
  },
  hasSubTitle: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'tabler-users',
  },
  modalActions: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['ok', 'close', 'update:search']);
const AppStore = useAppStore();

// REFS
const { PageMeta } = storeToRefs(AppStore);
const dialog = ref(false);

// Getters

// Functions
const openDialog = () => (dialog.value = true);
const closeDialog = () => (dialog.value = false);
const saveEvent = () => emit('ok');

// Watchers

defineExpose({
  openDialog,
  closeDialog,
});
</script>

<template>
  <div class="page">
    <slot name="header">
      <div class="page-header py-4 flex-col lg:flex-row">
        <div class="flex gap-3 title items-center lg:justify-end">
          <h3 class="font-bold">
            {{ hasSubTitle? subTitle: PageMeta.title }}
          </h3>
          <VIcon v-if="PageMeta.icon" color="primary"
            :icon="PageMeta.icon" />
        </div>

        <div
          class="min-w-full md:min-w-[500px] flex justify-end items-center lg:mt-0">
          <slot name="actions">
            <VTextField v-if="hasSearch" class="w-92" type="text"
              prepend-inner-icon="mdi-magnify" :label="props.placeholder"
              @update:model-value="$emit('update:search', $event)" />

       
          </slot>
          <slot name="action-button">
            <VDialog v-model="dialog" scrollable persistent
              color="primary" width="992">
              <template #activator="{ props }">
                <VBtn v-if="add" v-bind="props" id="btn_btn"
                  prepend-icon="mdi-plus" variant="flat">
                  {{ buttonText }}
                </VBtn>
              </template>
              <VCard>
                <VCardTitle
                  class="p-2 text-lg flex justify-between items-center">
                  <span>
                    <VIcon v-if="icon" color="primary" size="small"> {{
                      icon
                    }}</VIcon>
                    {{ dialogTitle }}
                  </span>

                  <VBtn icon="mdi-close" variant="text" type="button"
                    @click="closeDialog" />
                </VCardTitle>

                <main class="p-2">
                  <slot name="dialog-form" />
                </main>

                <VDivider />
                <VCardActions v-if="modalActions">
                  <VBtn variant="flat" @click="saveEvent">
                    حفظ
                  </VBtn>
                  <VBtn variant="tonal" @click="dialog = false">
                    تراجع
                  </VBtn>
                </VCardActions>
              </VCard>
            </VDialog>
          </slot>
        </div>
      </div>
    </slot>

    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.page {

  .page-header {
    display: flex;
    justify-content: space-between;
    background-color: transparent !important;
    inline-size: 100%;
  }

  .v-input__control {
    display: flex;
    align-items: center;
    block-size: 3rem;
    grid-area: control;
  }

  .svg {
    color: rgb(140, 185, 65, 100%);
    margin-block-start: 10px;
    text-align: center;
  }

  .svg:hover {
    color: rgb(34, 51, 6);
  }

  #btn_btn {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-around;
    margin-inline: 10px;
    text-align: center;
  }
}
</style>
