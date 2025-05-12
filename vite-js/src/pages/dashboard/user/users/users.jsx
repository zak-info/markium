import { Helmet } from 'react-helmet-async';
import UsersListView from 'src/sections/user/Users/UsersListView';
// ----------------------------------------------------------------------

export default function UsersListPage({collection}) {
  return (
    <>
      <Helmet>
        <title> Settings: Roles Page</title>
      </Helmet>

      <UsersListView  />
    </>
  );
}
