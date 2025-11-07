import { Helmet } from 'react-helmet-async';

import { NotificationsListView } from 'src/sections/maintain/view';
import NotificationsListView2 from 'src/sections/maintain/view/NotificationsListView2';

// ----------------------------------------------------------------------

export default function NotificationsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance List</title>
      </Helmet>

      <NotificationsListView />
      <NotificationsListView2 />
    </>
  );
}
