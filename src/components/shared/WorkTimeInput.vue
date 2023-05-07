<script lang="ts" setup>
import { WorkTimeDto } from '@/types/shared/WorkTimes';
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue';
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as PropType<WorkTimeDto[]>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const mv = computed(() => props.modelValue);

const localValue = ref([new WorkTimeDto()]);

const days = ref<string[]>([
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
]);

function addNewWorkTimes() {
  localValue.value.push(new WorkTimeDto());
}
function addTimes(i: number) {
  // target.push(localValue.value);
  localValue.value[i].times.push({ ...new WorkTimeDto().times[0] })
}
function deleteWorkTime(index: number) {
  if (localValue.value.length > 1)
    localValue.value = localValue.value.filter((item, i) => +i !== +index);
}
function deletTime(i: number) {
  if (localValue.value[i].times.length > 1)
    localValue.value[i].times.pop()
}

onMounted(() => {
  if (props.modelValue.length)
    localValue.value = props.modelValue;

  else
    emit('update:modelValue', localValue.value);

});

watchArray(
  localValue,
  newVal => {
    emit('update:modelValue', newVal);
  },
  { deep: true },
);
watchArray(
  mv,
  newVal => {
    // console.log("changed model value");

    localValue.value = newVal;
  },
  { deep: true },
);
</script>

<template>
  <div>
    <div class="workTimes">
      <div class="flex items-center justify-between">
        <VLabel class="mb-2">
          اوقات الدوام
        </VLabel>
        <VBtn variant="outlined" @click="addNewWorkTimes">
          إضافة وقت
        </VBtn>
      </div>

      <VCard v-for="(workTime, i) in localValue" :key="i" class="workTime overflow-hidden p-2 my-3 border">
        <VBtnGroup>
          <VBtn variant="text" color="primary" icon="mdi-plus" @click="addTimes(i)" />
          <VBtn variant="text" color="error" icon="mdi-minus" @click="deletTime(i)" />
          <VBtn variant="text" color="error" icon="mdi-delete" @click="deleteWorkTime(i)" />
        </VBtnGroup>
        <div class="days my-3">
          <VBtnToggle v-model="localValue[i].daysOfWeek" class="px-0 overflow-visible relative left-[10px] min-w-[50px]"
            multiple color="primary" variant="outlined">
            <VBtn v-for="(day, b) in days" :key="b" :value="day" variant="flat">
              {{ day.substring(0, 2).toUpperCase() }}
            </VBtn>
          </VBtnToggle>

          <div v-for="(time, j) in workTime.times" :key="j"
            class="times my-2 flex justify-between items-center gap-4 md:gap-8">
            <AppDateTimePicker v-model="localValue[i].times[j].startTime" :config="{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'H:i',
            }" />
            <span>حتى</span>
            <AppDateTimePicker v-model="localValue[i].times[j].endTime" :config="{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'H:i',
            }" />
          </div>
        </div>
      </VCard>
    </div>
  </div>
</template>
