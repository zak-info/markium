import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { MotivationIllustration } from 'src/assets/illustrations';

import { useSettingsContext } from 'src/components/settings';

import SaasWelcome from '../saas-welcome';
import SaasActiveStores from '../saas-active-stores';
import SaasMonthlyRevenue from '../saas-monthly-revenue';
import SaasTopPerformers from '../saas-top-performers';
import SaasSubscriptionTiers from '../saas-subscription-tiers';
import SaasRevenueOverview from '../saas-revenue-overview';
import SaasWidgetSummary from '../saas-widget-summary';
import SaasRecentStores from '../saas-recent-stores';
import SaasPaymentStatus from '../saas-payment-status';
import { useContext } from 'react';
import { AuthContext } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export default function OverviewSaasView() {
  // const { user } = useMockedUser();
  const { user } = useContext(AuthContext);

  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <SaasWelcome
            title={`Welcome back! \n ${user?.name}`}
            description="Your SaaS platform is growing! You have 15% more active stores this month."
            img={<MotivationIllustration />}
            action={
              <Button variant="contained" color="primary">
                View Analytics
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <SaasActiveStores />
        </Grid>

        <Grid xs={12} md={4}>
          <SaasWidgetSummary
            title="Active Stores"
            percent={15.3}
            total={1247}
            chart={{
              series: [22, 18, 35, 50, 82, 84, 77, 42, 87, 93],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <SaasWidgetSummary
            title="Monthly Revenue"
            percent={8.2}
            total={284750}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 78],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <SaasWidgetSummary
            title="New Subscriptions"
            percent={12.8}
            total={189}
            chart={{
              colors: [theme.palette.success.light, theme.palette.success.main],
              series: [40, 70, 75, 70, 50, 28, 37, 64, 58, 67],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <SaasSubscriptionTiers
            title="Subscription Breakdown"
            total={1247}
            chart={{
              series: [
                { label: 'Basic', value: 45 },
                { label: 'Pro', value: 35 },
                { label: 'Enterprise', value: 20 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <SaasMonthlyRevenue
            title="Monthly Revenue Growth"
            subheader="(+23%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2023',
                  data: [
                    {
                      name: 'Revenue',
                      data: [180, 210, 195, 240, 260, 290, 320, 380, 420, 380, 440, 460],
                    },
                    {
                      name: 'Expenses',
                      data: [80, 95, 85, 110, 120, 130, 140, 160, 180, 160, 190, 200],
                    },
                  ],
                },
                {
                  year: '2024',
                  data: [
                    {
                      name: 'Revenue',
                      data: [220, 250, 280, 310, 340, 390, 420, 480, 520, 480, 550, 580],
                    },
                    {
                      name: 'Expenses',
                      data: [90, 105, 115, 125, 135, 150, 165, 180, 195, 185, 210, 220],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <SaasRevenueOverview 
            title="Revenue by Service" 
            data={[
              {
                label: 'Store Subscriptions',
                totalAmount: 156800,
                value: 45,
                color: 'primary'
              },
              {
                label: 'Transaction Fees',
                totalAmount: 89200,
                value: 28,
                color: 'info'
              },
              {
                label: 'Premium Features',
                totalAmount: 67400,
                value: 18,
                color: 'success'
              },
              {
                label: 'Support Services',
                totalAmount: 34200,
                value: 9,
                color: 'warning'
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <SaasPaymentStatus
            title="Payment Status"
            totalRevenue={284750}
            pendingAmount={12580}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <SaasTopPerformers
            title="Top Performing Stores"
            tableData={[
              {
                id: 1,
                name: 'TechGear Pro',
                owner: 'John Smith',
                category: 'Electronics',
                monthlyRevenue: 45600,
                growth: 23.5,
                status: 'active'
              },
              {
                id: 2,
                name: 'Fashion Forward',
                owner: 'Sarah Johnson',
                category: 'Fashion',
                monthlyRevenue: 38900,
                growth: 18.7,
                status: 'active'
              },
              {
                id: 3,
                name: 'Home Essentials',
                owner: 'Mike Davis',
                category: 'Home & Garden',
                monthlyRevenue: 32400,
                growth: 15.2,
                status: 'active'
              },
              {
                id: 4,
                name: 'Beauty Hub',
                owner: 'Emma Wilson',
                category: 'Beauty',
                monthlyRevenue: 28700,
                growth: 12.8,
                status: 'active'
              },
              {
                id: 5,
                name: 'Sports Central',
                owner: 'Chris Brown',
                category: 'Sports',
                monthlyRevenue: 24100,
                growth: 9.3,
                status: 'active'
              },
            ]}
            tableLabels={[
              { id: 'name', label: 'Store Name' },
              { id: 'category', label: 'Category' },
              { id: 'owner', label: 'Owner', align: 'center' },
              { id: 'monthlyRevenue', label: 'Revenue', align: 'right' },
              { id: 'growth', label: 'Growth %', align: 'right' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <SaasRecentStores 
            title="Recently Created Stores" 
            list={[
              {
                id: 1,
                name: 'Organic Delights',
                owner: 'Lisa Anderson',
                category: 'Food & Beverage',
                createdAt: new Date(),
                plan: 'Pro'
              },
              {
                id: 2,
                name: 'Pet Paradise',
                owner: 'Tom Wilson',
                category: 'Pet Supplies',
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                plan: 'Basic'
              },
              {
                id: 3,
                name: 'Art Gallery Plus',
                owner: 'Maria Garcia',
                category: 'Art & Crafts',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                plan: 'Enterprise'
              },
              {
                id: 4,
                name: 'Book Haven',
                owner: 'David Lee',
                category: 'Books',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                plan: 'Pro'
              },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
