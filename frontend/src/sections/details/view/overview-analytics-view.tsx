import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import Swal from 'sweetalert2';

import { DashboardContent } from 'src/layouts/dashboard';
import { fDateTime, fDateTimeToLocal } from 'src/utils/format-time';

import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { ModeGramView } from '../table/view/gram-view';
import { ModePcsView } from '../table/view/pcs-view';
import { Loading } from '../../../components/loading/loading';

import { DetailApi } from '../../../api/api';
import type { ModeGramProps } from '../table/gram-table-row';
import type { ModePcsProps } from '../table/pcs-table-row';
import type { DashboardProps } from '../../dashboard/post-item';

interface SummaryChartProps {
  date: string;
  fail_count: number;
  pass_count: number;
}

interface ModeGramDataProps {
  data: ModeGramProps[];
  pass_count: number;
  fail_count: number;
  average_per_minute: number;
  pass_percentage: number;
  fail_percentage: number;
  summary_days: SummaryChartProps[];
}

interface ModePcsDataProps {
  data: ModePcsProps[];
  pass_count: number;
  fail_count: number;
  average_per_minute: number;
  pass_percentage: number;
  fail_percentage: number;
  summary_days: SummaryChartProps[];
}

interface GetData {
  production: DashboardProps;
  modeGramData: ModeGramDataProps;
  modePcsData: ModePcsDataProps;
}

export function OverviewAnalyticsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<GetData | null>(null);
  const [categoriesChart, setCategoriesChart] = useState<string[]>([]);
  const [gramDataChart, setGramDataChart] = useState<number[]>([]);
  const [pcsDataChart, setPcsDataChart] = useState<number[]>([]);
  const post: DashboardProps = location.state || ({} as DashboardProps);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData: GetData = await DetailApi(post.production_id);

        setIsLoading(false);
        setData(getData);
        console.log(getData);

        // สร้าง categories จาก date ที่ไม่ซ้ำกัน
        const uniqueDates = [
          ...new Set([
            ...getData.modeGramData.summary_days.map((item) => fDateTime(item.date, 'DD/MM/YYYY')).filter((time) => time !== null), // กำจัดค่าที่เป็น null
            ...getData.modePcsData.summary_days.map((item) => fDateTime(item.date, 'DD/MM/YYYY')).filter((time) => time !== null), // กำจัดค่าที่เป็น null
          ]),
        ];
        const categories = uniqueDates.sort(); // เรียงวันที่ให้ถูกต้อง
        
        // สร้าง gramDataChart และ pcsDataChart โดยใช้ pass_count
        const _gramDataChart = categories.map((time) => {
          const gramEntry = getData.modeGramData.summary_days.find((item) => fDateTime(item.date, 'DD/MM/YYYY') === time);
          return gramEntry ? gramEntry.pass_count : 0;
        });

        const _pcsDataChart = categories.map((time) => {
          const pcsEntry = getData.modePcsData.summary_days.find((item) => fDateTime(item.date, 'DD/MM/YYYY') === time);
          return pcsEntry ? pcsEntry.pass_count : 0;
        });

        setCategoriesChart(categories);
        setGramDataChart(_gramDataChart);
        setPcsDataChart(_pcsDataChart);
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          navigate('/sign-in');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด...',
            text: 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้!',
            showConfirmButton: false,
          });
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [navigate, post.production_id]);

  return (
    <>
      <Loading isShowing={isLoading} />
      {data && (
        <DashboardContent maxWidth="xl">
          <Card
            sx={{
              mb: { xs: 3, md: 5 },
              p: 3,
              boxShadow: 'none',
              position: 'relative',
              backgroundColor: 'common.white',
            }}
          >
            <Typography variant="h4">เครื่อง {data.production.machine}</Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                color: 'gray',
              }}
            >
              {`เลขที่ผลิต ${data.production.lot_number ? data.production.lot_number : 'XXXXXX'}`}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                color: 'gray',
              }}
            >
              {`ชื่อยา ${data.production.product_name ? data.production.product_name : 'XXXXXX'}`}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                color: 'grey',
              }}
            >
              {`ขนาดการผลิต ${data.production.batch_size ? data.production.batch_size.toLocaleString() : 'XXXXXX'}`}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                mb: 1,
                color: 'grey',
              }}
            >
              {`วันที่เริ่มการผลิต ${data.production.start_product ? fDateTime(data.production.start_product) : 'XXXXXX'}`}
              <br />
              {`วันที่จบการผลิต ${data.production.finish_product ? fDateTime(data.production.finish_product) : 'XXXXXX'}`}
            </Typography>
          </Card>

          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="จำนวน PASS (กรัม)"
                percent={data.modeGramData?.pass_percentage || 0}
                total={data.modeGramData?.pass_count || 0}
                color="success"
                icon={<img alt="icon" src="./assets/icons/repo/scale1.svg" />}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [22, 8, 35, 50, 82, 84, 77, 12],
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="จำนวน FAIL (กรัม)"
                percent={data.modeGramData?.fail_percentage || 0}
                total={data.modeGramData?.fail_count || 0}
                color="error"
                icon={<img alt="icon" src="./assets/icons/repo/scale2.svg" />}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [56, 47, 40, 62, 73, 30, 23, 54],
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="จำนวน PASS (PCS)"
                percent={data.modePcsData?.pass_percentage || 0}
                total={data.modePcsData?.pass_count || 0}
                color="success"
                icon={<img alt="icon" src="./assets/icons/repo/scale1.svg" />}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [40, 70, 50, 28, 70, 75, 7, 64],
                }}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title="จำนวน FAIL (PCS)"
                percent={data.modePcsData?.fail_percentage || 0}
                total={data.modePcsData?.fail_count || 0}
                color="error"
                icon={<img alt="icon" src="./assets/icons/repo/scale2.svg" />}
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [56, 30, 23, 54, 47, 40, 62, 73],
                }}
              />
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              {categoriesChart.length <= 0 ? null : (
                <AnalyticsWebsiteVisits
                  title="กราฟข้อมูลการชั่ง"
                  subheader={`${fDateTime(post.start_product)} ถึง ${fDateTime(post.finish_product)}`}
                  unit="กล่อง"
                  chart={{
                    categories: categoriesChart,
                    series: [
                      { name: 'Gram', data: gramDataChart },
                      { name: 'PCS', data: pcsDataChart },
                    ],
                  }}
                />
              )}
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              <ModeGramView dataGram={data.modeGramData.data} />
            </Grid>

            <Grid xs={12} md={12} lg={12}>
              <ModePcsView dataPcs={data.modePcsData.data} />
            </Grid>
          </Grid>
        </DashboardContent>
      )}
    </>
  );
}
