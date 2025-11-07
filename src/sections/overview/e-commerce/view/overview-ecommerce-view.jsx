import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { MotivationIllustration } from 'src/assets/illustrations';
import {
  _ecommerceNewProducts,
  _ecommerceBestSalesman,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import EcommerceWelcome from '../ecommerce-welcome';
import EcommerceNewProducts from '../ecommerce-new-products';
import EcommerceYearlySales from '../ecommerce-yearly-sales';
import EcommerceBestSalesman from '../ecommerce-best-salesman';
import EcommerceSaleByGender from '../ecommerce-sale-by-gender';
import EcommerceSalesOverview from '../ecommerce-sales-overview';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';
import EcommerceLatestProducts from '../ecommerce-latest-products';
import EcommerceCurrentBalance from '../ecommerce-current-balance';
import { useContext } from 'react';
import { AuthContext } from 'src/auth/context/jwt';
import { useTranslation } from 'react-i18next';
import { useGetProducts } from 'src/api/product';
import { useGetOrders } from 'src/api/orders';
import { paths } from 'src/routes/paths';
import { Link } from '@mui/material';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function OverviewEcommerceView() {
  const { user } = useContext(AuthContext);
  const {products} = useGetProducts()
  const {orders} = useGetOrders()

  const theme = useTheme();

  const settings = useSettingsContext();

  const { t } = useTranslation();
  const router = useRouter()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <EcommerceWelcome
            title={`${t('welcome_back')} \n ${user?.name}`}
            description={t('manage_store_description')}
            img={<MotivationIllustration />}
            action={
              <Button onClick={()=>{router.push(paths.dashboard.order.root)}} variant="contained" color="primary">
                {t('view_orders')}
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceNewProducts list={_ecommerceNewProducts} />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('products_published')}
            percent={2.6}
            total={products?.length || "0"}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('orders_received')}
            percent={-0.1}
            total={orders?.length || "0"}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={t('order_confirmed')}
            percent={0.6}
            total={orders?.filter( i => i.status == "confirmed")?.length || "0"}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceSaleByGender
            title={t('order_status')}
            total={orders?.length || "0"}
            chart={{
              series: [
                { label: t('pending'), value: orders?.filter( i => i.status == "pending")?.length },
                { label: t('delivered'), value: orders?.filter( i => i.status == "delivered")?.length },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title={t('orders_and_revenue')}
            subheader={t('yearly_comparison')}
            chart={{
              categories: [
                t('jan'),
                t('feb'),
                t('mar'),
                t('apr'),
                t('may'),
                t('jun'),
                t('jul'),
                t('aug'),
                t('sep'),
                t('oct'),
                t('nov'),
                t('dec'),
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: t('total_revenue'),
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: t('total_orders'),
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: t('total_revenue'),
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: t('total_orders'),
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <EcommerceSalesOverview title={t('orders_overview')} data={_ecommerceSalesOverview} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceCurrentBalance
            title={t('store_balance')}
            currentBalance={187650}
            sentAmount={25500}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <EcommerceBestSalesman
            title={t('top_products')}
            tableData={_ecommerceBestSalesman}
            tableLabels={[
              { id: 'name', label: t('product') },
              { id: 'category', label: t('category') },
              { id: 'country', label: t('location'), align: 'center' },
              { id: 'totalAmount', label: t('sales'), align: 'right' },
              { id: 'rank', label: t('rank'), align: 'right' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts title={t('latest_products')} list={_ecommerceLatestProducts} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
