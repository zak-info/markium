import { Helmet } from 'react-helmet-async';

import { UserEditView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit a  Document</title>
      </Helmet>

      <UserEditView />
    </>
  );
}
