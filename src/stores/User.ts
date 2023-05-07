import { UserApi } from '@/api/User/UserEndpoint';
import { useApi } from '@/composables/index';
import { useEmployeeStore } from '@/stores/Employee';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('User', () => {
  const { POST } = useApi()
  const EmployeeStore = useEmployeeStore()

  // Block User
  async function BlockUser(id: any) {
    await POST(UserApi.Block + id);
    isBlock(true);
  }

  async function UnBlockUser(id: any) {
    await POST(UserApi.UnBlock + id);
    isBlock(false);
  }

  function isBlock(payload: any) {
    EmployeeStore.employeeDetailsDto.isBlock = payload;
  }

  return {
    BlockUser,
    UnBlockUser,
  }
})
