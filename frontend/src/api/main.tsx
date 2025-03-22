import axios from 'axios';
import { API_URL } from './config/link_api';
import type { ProductionsProps } from '../sections/production/table-row';
import type { FormProps } from '../sections/auth/sign-in-view';

// สร้าง instance ของ axios
const api = axios.create({
  baseURL: API_URL.BASE_URL, // เริ่มต้นด้วย _HOST_MAIN
  withCredentials: true, // ✅ สำคัญมาก เพื่อให้ Cookie ถูกส่งไป-กลับ
  timeout: 10000, // 10 วินาที
});

// Want to use async/await? Add the `async` keyword to your outer function/method.
export async function LoginApi(form: FormProps) {
  try {
    const response = await api.post(API_URL.LOGIN, form, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function LogoutApi() {
  try {
    const response = await api.post(API_URL.LOGOUT, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function DashboardApi() {
  try {
    const response = await api.get(API_URL.GET_DASHBOARD, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function ProductionApi() {
  try {
    const response = await api.get(API_URL.GET_PRODUCTION, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function ProductionUpdateApi(form: ProductionsProps) {
  try {
    const response = await api.post(
      API_URL.POST_PRODUCTION_UPDATE,
      {
        production_id: form.production_id,
        machine: form.machine,
        lot_number: form.lot_number,
        product_name: form.product_name,
        batch_size: form.batch_size,
        start_product: form.start_product,
        finish_product: form.finish_product,
        notes: form.notes,
      },
      {
        headers: {
          ...API_URL.CONTENT_TYPE,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function ProductionDeleteApi(form: ProductionsProps) {
  try {
    const response = await api.post(
      API_URL.POST_PRODUCTION_DELETE,
      {
        production_id: form.production_id,
      },
      {
        headers: {
          ...API_URL.CONTENT_TYPE,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function DetailApi(production_id: number) {
  try {
    const response = await api.post(
      API_URL.GET_DETAILS,
      { production_id },
      {
        headers: {
          ...API_URL.CONTENT_TYPE,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching production details:', error);
    throw error;
  }
}

export async function ProductListsApi() {
  try {
    const response = await api.get(API_URL.GET_PRODUCT_LISTS, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function MachineListsApi() {
  try {
    const response = await api.get(API_URL.GET_MACHINE_LISTS, {
      headers: {
        ...API_URL.CONTENT_TYPE,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
