import { Helmet } from 'react-helmet-async';

import { UserEditView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new client</title>
      </Helmet>

      <UserEditView />
    </>
  );
}
