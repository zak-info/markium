import { Helmet } from 'react-helmet-async';
import RolesListView from 'src/sections/user/Roles/RolesListView';
// ----------------------------------------------------------------------

export default function RolesListPage({collection}) {
  return (
    <>
      <Helmet>
        <title> Settings: Roles Page</title>
      </Helmet>

      <RolesListView  />
    </>
  );
}
