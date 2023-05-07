import type { GetAllEmployee, GetDetailsEmployeeDto } from '@/api/Employee/dto';
import { EmployeeApi } from '@/api/Employee/endpoints';
import { useApi, usePagination } from '@/composables/index';
import { defineStore } from 'pinia';
import { AddEmployee as AddEmployeeDto, DetailsEmployee, GetAllEmployeeFilters } from './../api/Employee/dto';

export const useEmployeeStore = defineStore('Employee', () => {
  const { GET, POST, DELETE } = useApi()
  const orderEmployee = ref<GetDetailsEmployeeDto>()
  const EmployeeList = ref<GetAllEmployee[]>([])
  const List = ref<GetAllEmployee[]>([]);
  const employeeDto = ref(new AddEmployeeDto())
  const employeeDetailsDto = ref(new DetailsEmployee())
  const filterVal = ref('');
  const { pagination } = usePagination()
  const filterDto = ref<GetAllEmployeeFilters>(new GetAllEmployeeFilters());
  const searchEmployee = ref('')

  const roleList = ref([
    {
      value: 1,
      name: 'DataEntry',
    },
    {
      value: 2,
      name: 'OrderHandler',
    },
    {
      value: 3,
      name: 'Accountant',
    },
    {
      value: 4,
      name: 'Marketer',
    },
  ])

  // Get All Employee
  async function GetAllEmployee() {
    try {
      const response = await GET<GetAllEmployee[]>(
        EmployeeApi.GetAll,
      )

      EmployeeList.value = response.data
      List.value = response.data;

      return response
    }
    catch (er) {
      console.log('ERROR FOLDER', er)
    }
  }

  // Get Details Employee
  async function GetDetailsEmployee(id: any) {
    const response: any = await GET<GetDetailsEmployeeDto>(EmployeeApi.GetById + id, { ...pagination.value, ...filterDto.value });

    orderEmployee.value = response.data
    employeeDetailsDto.value = response.data.employee
    pagination.value.totalCount = response.data.orderPagination

    console.log(response)
  }

  // Add Employee
  async function AddEmployee(payload: any) {
    const response = await POST(EmployeeApi.Add, payload,
      { error: true, success: 'تمت الاضافة بنجاح' },
      { formData: true },
    )

    console.log(response)
    EmployeeList.value?.unshift(payload)
  }

  // Modify Employee
  async function ModifyEmployee(payload: DetailsEmployee) {
    const response = await POST(EmployeeApi.Modify, payload,
      { success: 'تم التعديل بنجاح' },
      { formData: true },
    )

    employeeDetailsDto.value = { ...response.data };
  }

  // Delete Employee
  async function DeleteEmployee(ids: string[]) {
    await DELETE(EmployeeApi.Delete, ids);

    EmployeeList.value = EmployeeList.value?.filter((item: any) => !ids.includes(item.id))
  }

  // filter Employee
  const filterListEmployee = computed(() => {
    return EmployeeList.value.filter(
      (ele: { name: string; address: string; email: string }) =>
        ele.name.toLowerCase().includes(filterVal.value.toLowerCase())
        || ele.address.toLowerCase().includes(filterVal.value.toLowerCase())
        || ele.email.toLowerCase().includes(filterVal.value.toLowerCase())
        || !EmployeeList.value,
    );
  });

  // Search
  function findEmployee(payload: string) {
    filterVal.value = payload;
  }

      const search = () => {
        EmployeeList.value = EmployeeList.value.filter((el: any) => {
          return el.name
            .toLowerCase()
            .includes(searchEmployee.value.toLocaleLowerCase());
        });
      };
      const filter = () => {
        EmployeeList.value = List.value;
        if (searchEmployee.value !== "") search();
      };

      watch(searchEmployee, () => {
        filter();
      });



  return {
    GetAllEmployee,
    GetDetailsEmployee,
    EmployeeList,
    AddEmployee,
    ModifyEmployee,
    DeleteEmployee,
    roleList,
    pagination,
    filterListEmployee,
    findEmployee,
    employeeDto,
    employeeDetailsDto,
    orderEmployee,
    searchEmployee,
  };
})
