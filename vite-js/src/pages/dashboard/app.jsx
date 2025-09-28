import { Helmet } from 'react-helmet-async';

import { OverviewAppView } from 'src/sections/overview/app/view';
import Dashboard from 'src/sections/overview/app/view/Dashboard';
import DashboardStat from 'src/sections/overview/app/view/DashboardStat';
import { OverviewEcommerceView } from 'src/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Markium</title>
      </Helmet>
      <OverviewEcommerceView />

      {/* <DashboardStat /> */}
      {/* <Dashboard /> */}

      {/* <OverviewAppView /> */}
    </>
  );
}
