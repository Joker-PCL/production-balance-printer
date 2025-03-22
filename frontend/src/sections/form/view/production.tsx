import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import 'dayjs/locale/th';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import Swal from 'sweetalert2';

import { useRouter } from 'src/routes/hooks';
import { fDateTimeToLocal } from 'src/utils/format-time';
import { ProductListsApi, MachineListsApi, ProductionUpdateApi } from '../../../api/api';

import { ProductSearch } from '../product-search';
import type { ProductionsProps } from '../../production/table-row';
import { MachineSearch } from '../machine-search';

dayjs.locale('th');

// ----------------------------------------------------------------------
// รายชื่อยาในฐานข้อมูล
export type ProductListsProps = {
  product_id: number;
  product_name: string;
};

// รายชื่อเครื่องจักรในฐานข้อมูล
export type MachineListsProps = {
  serial_number: string;
  machine: string;
  last_connect: string;
  machine_img: string;
  group: string;
};

export function FormProduction() {
  const router = useRouter();
  const location = useLocation();
  const navigate = useNavigate();
  const form = UseFormProduction();
  const [loadingData, setLoadingData] = useState(false);
  const { row }: { row?: ProductionsProps } = location.state || {};
  const [productLists, setProductLists] = useState([]);
  const [machineLists, setMachineLists] = useState([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    form.setForm(name, value);
  };

  const handleChangeDateField = (field: string, newValue: Dayjs | null) => {
    setDate(newValue);
    form.setForm(field, newValue ? newValue.format('YYYY-MM-DD HH:mm:ss') : '');
  };

  const [date, setDate] = React.useState<Dayjs | null>(null);

  const handleSubmit = useCallback(() => {
    console.log('Form Data before validation:', form.formData); // Check form data
    const newFormError = {
      lot_number: form.formData.lot_number === '',
      product_name: form.formData.product_name === '',
      batch_size: form.formData.batch_size <= 0,
      machine: form.formData.machine === '',
      start_product: form.formData.start_product === '',
      finish_product: form.formData.finish_product === '',
    };

    form.setFormDataError(newFormError);

    // ตรวจสอบว่ามี error หรือไม่
    const hasError = Object.values(newFormError).some((error) => error);
    if (hasError) {
      console.log('Form submission failed, please correct the errors.');
    } else {
      const fetchData = async () => {
        try {
          const response = await ProductionUpdateApi(form.formData); // Wait for the promise to resolve
          router.back();

          Swal.fire({
            icon: 'success',
            title: 'ดำเนินการเรียบร้อยแล้ว',
            text: 'บันทึกรายการผลิตเรียบร้อยแล้ว',
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          if (error.status === 401 || error.status === 403) {
            navigate('/sign-in');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด...',
              text: 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้!, ลองไหม่อีกครั้ง',
              showCancelButton: true,
              cancelButtonText: 'ปิด',
            });
            console.error('Error fetching data:', error);
          }
        }
      };

      fetchData(); // Call the async function to fetch the data
    }
  }, [form, router, navigate]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    if (!loadingData) {
      const fetchData = async () => {
        try {
          const getProductLists = await ProductListsApi(); // Wait for the promise to resolve
          const getMachineLists = await MachineListsApi(); // Wait for the promise to resolve
          setProductLists(getProductLists);
          setMachineLists(getMachineLists);
          console.log(getMachineLists);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Call the async function to fetch the data

      if (row) {
        form.setFormData({
          production_id: row.production_id,
          timestamp: row.timestamp,
          lot_number: row.lot_number,
          product_name: row.product_name,
          batch_size: row.batch_size,
          machine: row.machine,
          start_product: fDateTimeToLocal(row.start_product) ?? '',
          finish_product: fDateTimeToLocal(row.finish_product) ?? '',
          notes: row.notes,
        });
      }

      setLoadingData(true);
    }
  }, [row, form, loadingData]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        name="lot_number"
        label="เลขที่ผลิต"
        placeholder="Lot number..."
        value={form.formData?.lot_number ?? ''}
        fullWidth
        onChange={handleChange}
        error={form.formError.lot_number}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <ProductSearch
        posts={productLists}
        sx={{ px: 3 }}
        product_name={form.formData?.product_name ?? ''}
        error={form.formError.product_name}
        onChange={handleChange}
        onSearch={(event: React.SyntheticEvent, value: string) => {
          form.setForm('product_name', value);
        }}
      />

      <TextField
        name="batch_size"
        label="ขนาดผลิต"
        placeholder="Batch size..."
        type="number"
        value={form.formData?.batch_size ?? 0}
        error={form.formError.batch_size}
        fullWidth
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <MachineSearch
        posts={machineLists}
        sx={{ px: 3 }}
        machine={form.formData?.machine ?? ''}
        error={form.formError.machine}
        onChange={handleChange}
        onSearch={(event: React.SyntheticEvent, value: string) => {
          form.setForm('machine', value);
        }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          value={form.formData.start_product ? dayjs(form.formData.start_product) : null}
          onChange={(newValue) => {
            handleChangeDateField('start_product', newValue);
          }}
          label="วันที่เริ่มการผลิต"
          onError={console.log}
          ampm={false}
          renderInput={(params) => <TextField name="start_product" placeholder="วัน/เดือน/ปี ชั่วโมง:นาที" InputLabelProps={{ shrink: true }} sx={{ mb: 3 }} fullWidth {...params} />}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateTimePicker
          value={form.formData.finish_product ? dayjs(form.formData.finish_product) : null}
          onChange={(newValue) => {
            handleChangeDateField('finish_product', newValue);
          }}
          label="วันที่จบการผลิต"
          onError={console.log}
          ampm={false}
          renderInput={(params) => <TextField name="finish_product" placeholder="วัน/เดือน/ปี ชั่วโมง:นาที" InputLabelProps={{ shrink: true }} sx={{ mb: 3 }} fullWidth {...params} />}
        />
      </LocalizationProvider>

      <TextField name="notes" label="ลงบันทึกเพิ่มเติม" placeholder="Note..." value={form.formData?.notes ?? ''} fullWidth onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ mb: 3 }} />

      <LoadingButton fullWidth sx={{ mb: 2 }} size="large" type="submit" color="success" variant="contained" onClick={handleSubmit}>
        บันทึก
      </LoadingButton>

      <LoadingButton fullWidth size="large" type="button" color="error" variant="contained" onClick={handleCancel}>
        ยกเลิก
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Card
        sx={{
          mx: { xs: 3, md: 20 },
          mb: 5,
          px: { xs: 1, md: 8 },
          py: 5,
          boxShadow: 'none',
          position: 'relative',
          backgroundColor: 'common.white',
        }}
      >
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" mb={5}>
          <Typography variant="h4">แบบฟอร์มการผลิต</Typography>
        </Box>
        {renderForm}
      </Card>
    </>
  );
}

export function UseFormProduction() {
  const [formData, setFormData] = useState<ProductionsProps>({
    production_id: '',
    timestamp: '',
    lot_number: '',
    product_name: '',
    batch_size: 0,
    machine: '',
    start_product: '',
    finish_product: '',
    notes: '',
  });

  const [formError, setFormDataError] = useState({
    lot_number: false,
    product_name: false,
    batch_size: false,
    machine: false,
    start_product: false,
    finish_product: false,
  });

  const setForm = (name: string, value: string | number) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormDataError({
      ...formError,
      [name]: false,
    });
  };

  return {
    setForm,
    formData,
    setFormData,
    formError,
    setFormDataError,
  };
}
