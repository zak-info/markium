import { Helmet } from 'react-helmet-async';

import { UserEditView } from 'src/sections/drivers/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new document</title>
      </Helmet>

      <UserEditView />
    </>
  );
}
