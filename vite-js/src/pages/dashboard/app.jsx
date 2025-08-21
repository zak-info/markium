import { Helmet } from 'react-helmet-async';

import { OverviewAppView } from 'src/sections/overview/app/view';
import Dashboard from 'src/sections/overview/app/view/Dashboard';
import DashboardStat from 'src/sections/overview/app/view/DashboardStat';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Zaity</title>
      </Helmet>

      {/* <DashboardStat /> */}
      <Dashboard />

      {/* <OverviewAppView /> */}
    </>
  );
}
