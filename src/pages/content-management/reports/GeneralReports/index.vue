<script setup lang="ts">
import Page from "@/components/shared/Page.vue";
import { useAppStore } from "@/stores/App";
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { storeToRefs } from "pinia";
import { hexToRgb } from "@layouts/utils";
import LineChart from "@core/libs/chartjs/components/LineChart";
import { getLineChartConfig } from "@core/libs/chartjs/chartjsConfig";
import { useReports } from "@/stores/Reports";

const Store = useReports();
const { yearVal, CharDto } = storeToRefs(Store);
const orders = computed(() => Store.CharDto);
// function changeVal() {
//   Store.GetAllOrdersChart(yearVal);
// }

const vuetifyTheme = useTheme();

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "uil:analytics",
    title: "تقارير وإحصائيات",
  });
};

onLoad();
Store.GetAllOrdersChart(yearVal.value);
const chartOptions1 = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;

  const labelColor = `rgba(${hexToRgb(currentTheme["on-surface"])},${
    variableTheme["disabled-opacity"]
  })`;

  const legendColor = `rgba(${hexToRgb(currentTheme["on-background"])},${
    variableTheme["high-emphasis-opacity"]
  })`;

  const borderColor = `rgba(${hexToRgb(
    String(variableTheme["border-color"])
  )},${variableTheme["border-opacity"]})`;

  return {
    bar: {
      chart: {
        parentHeightOffset: 0,
        stacked: true,
        type: "bar",
        toolbar: { show: false },
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadius: 8,
          startingShape: "rounded",
          endingShape: "rounded",
        },
      },
      colors: [currentTheme.primary, currentTheme.warning],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 6,
        lineCap: "round",
        colors: [currentTheme.surface],
      },
      legend: {
        show: true,
        horizontalAlign: "left",
        position: "top",
        fontFamily: "Public Sans",
        markers: {
          height: 12,
          width: 12,
          radius: 12,
          offsetX: -3,
          offsetY: 2,
        },
        labels: {
          colors: legendColor,
        },
        itemMargin: {
          horizontal: 5,
        },
      },
      grid: {
        show: false,
        padding: {
          bottom: -8,
          top: 20,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            fontSize: "14px",
            colors: labelColor,
            fontFamily: "Public Sans",
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          offsetX: -16,
          style: {
            fontSize: "14px",
            colors: labelColor,
            fontFamily: "Public Sans",
          },
        },
        min: 0,
        max: 300,
        tickAmount: 5,
      },
      responsive: [
        {
          breakpoint: 1700,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "43%",
              },
            },
          },
        },
        {
          breakpoint: 1441,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "52%",
              },
            },
          },
        },
        {
          breakpoint: 1280,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "38%",
              },
            },
          },
        },
        {
          breakpoint: 1025,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
            chart: {
              height: 390,
            },
          },
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "38%",
              },
            },
          },
        },
        {
          breakpoint: 850,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "48%",
              },
            },
          },
        },
        {
          breakpoint: 449,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
            chart: {
              height: 360,
            },
            xaxis: {
              labels: {
                offsetY: -5,
              },
            },
          },
        },
        {
          breakpoint: 394,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "88%",
              },
            },
          },
        },
      ],
      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },
    },
    line: {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: "line",
      },
      stroke: {
        curve: "smooth",
        dashArray: [5, 0],
        width: [1, 2],
      },
      legend: {
        show: false,
      },
      colors: [borderColor, currentTheme.primary],
      grid: {
        show: false,
        borderColor,
        padding: {
          top: -30,
          bottom: -15,
          left: 25,
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
});

const series1 = computed(() => ({
  bar: [
    {
      name: "Earning",
      data: orders.value.ordersCount,
    },
  ],
  line: [
    {
      name: "This Month",
      data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
    },
  ],
}));

const chartConfig = computed(() =>
  getLineChartConfig(vuetifyTheme.current.value)
);

const data = computed(() => ({
  labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
  datasets: [
    {
      fill: false,
      tension: 0.5,
      label: " قيمة الطلب",
      pointRadius: 1,
      pointHoverRadius: 5,
      pointStyle: "circle",
      borderColor: "green",
      backgroundColor: "green",
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: "green",
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: "green",
      data: orders.value.totalCoast,
    },
    {
      fill: false,
      tension: 0.5,
      pointRadius: 2,
      label: "  قيمة التوصيل",
      pointHoverRadius: 5,
      pointStyle: "circle",
      borderColor: "yellow",
      backgroundColor: "yellow",
      pointHoverBorderWidth: 5,
      pointHoverBorderColor: "primary",
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: "yellow",
      data: orders.value.totalDeliveryCoast,
    },
  ],
}));
const print = () => {
  window.print();
};
</script>

<template>
  <Page :add="false" :has-search="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3 btnExport">
        <VBtn color="primary" @click="print"> طباعة </VBtn>
      </div>
    </template>
    <div class="md:w-full my-9">
      <VCard>
        <VRow no-gutters>
          <VCol
            cols="12"
            sm="12"
            lg="12"
            :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'"
          >
            <VCardTitle>
              <div class="flex justify-between items-center p-2">
                <div class="flex flex-col">
                  <p>تغير الطلبات</p>
                  <p class="text-xs -mt-2 text-slate-500">
                    2020 Total Sales: 12.84k
                  </p>
                </div>
                <div>
                  <VSelect
                    v-model="yearVal"
                    class="w-[100px]"
                    :value="yearVal"
                    :items="['2023', '2024', '2025']"
                    @change="Store.GetAllOrdersChart(yearVal)"
                  />
                </div>
              </div>
            </VCardTitle>
            <div class="mx- flex justify-center items-center md:w-full">
              <VCardText class="pe-2">
                <VueApexCharts
                  :options="chartOptions1.bar"
                  :series="series1.bar"
                  height="365"
                />
              </VCardText>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </div>
    <div class="my-12">
      <VCard class="p-3">
        <div class="flex justify-between items-center">
          <p class="p-2">تغير السعر</p>
        </div>

        <div>
          <LineChart
            :chart-options="chartConfig"
            :height="500"
            :chart-data="data"
          />
        </div>
      </VCard>
    </div>
  </Page>
</template>

<style>
@media print {
  .layout-vertical-nav {
    display: none !important;
  }
  .layout-navbar {
    display: none !important;
  }
  .layout-content-wrapper {
    padding: 0px !important;
  }
  .layout-footer {
    display: none !important;
  }
  /* .page-header {
    display: none !important;
  } */
  .btnExport {
    display: none !important;
  }
}
</style>

<route lang="yaml">
meta:
  roles: ["SuperAdmin", "Accountant"]
</route>
