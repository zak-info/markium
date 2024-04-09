import { Helmet } from 'react-helmet-async';

import { CurrentInMaintainListView } from 'src/sections/maintain/view';

// ----------------------------------------------------------------------

export default function NotificationsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance List</title>
      </Helmet>

      <CurrentInMaintainListView />
    </>
  );
}
