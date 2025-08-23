import React, { useState } from 'react';
import {
  Card,
  Container,
  Tab,
  Tabs,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import ZaityHeadContainer from 'src/sections/ZaityTables/ZaityHeadContainer';
import { t } from 'i18next';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import GeneralStatistics from './GeneralStatistics';
import { Box } from '@mui/system';
import OpearationalStat from './OpearationalStat';
import SvgColor from 'src/components/svg-color';
import OverviewEcommercePage from 'src/pages/dashboard/ecommerce';
import OverviewAnalyticsPage from 'src/pages/dashboard/analytics';
import OverviewBankingPage from 'src/pages/dashboard/banking';
import DangerAlerts from './DangerAlerts';
import DailyTasks from './DailyTasks';


// Mock data for testing



const Dashboard = () => {


  const [section, setSection] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSection(newValue);
  };




  return (
    <ZaityHeadContainer
      heading={t("dashboard")}

      links={[
        { name: t('dashboard'), href: paths.dashboard.root },
        { name: t("statistics"), href: paths.dashboard.vehicle.new },
        // { name: t('list') },
      ]}
    >


      <Card sx={{ p: 1 }}>
        <Tabs
          value={section}
          onChange={handleTabChange}
          aria-label="icon position tabs example"
          textColor="primary"
        >
          <Tab icon={<Iconify icon="solar:align-left-bold-duotone" />} iconPosition="start" label={t("general-stat")} />
          <Tab icon={<SvgColor src={`/assets/icons/navbar/ic_analytics.svg`} />} iconPosition="start" label={t("functional_data")} />
          <Tab icon={<Iconify icon="solar:danger-circle-bold" />} iconPosition="start" textColor='error' label={t("danger_alerts")} />
          <Tab icon={<Iconify icon="uim:layers-alt" />} iconPosition="start" textColor='error' label={t("daily_tasks")} />
          {/* <Tab icon={<SvgColor src={`/assets/icons/navbar/ic_analytics.svg`} />} iconPosition="start" label={t("kpi")} /> */}

        </Tabs>
      </Card>

      <Box mt={3}>
        {
          section === 0 ?
            <GeneralStatistics />
            : section === 1 ?
              <OpearationalStat />
              : section === 2 ?
                <DangerAlerts />
                : section === 3 ?
                  <DailyTasks />
                  : section === 4 ?
                    <>
                      <OverviewEcommercePage />
                      <OverviewAnalyticsPage />
                      <OverviewBankingPage />
                    </>
                    :
                    null
        }


        {/* section === 2 ?
                <>
                  <OverviewEcommercePage />
                  <OverviewAnalyticsPage />
                  <OverviewBankingPage />
                </> */}

      </Box>
    </ZaityHeadContainer>
  );
};

export default Dashboard; 