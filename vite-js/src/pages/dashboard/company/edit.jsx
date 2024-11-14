import { Helmet } from 'react-helmet-async';

import { CompanyEditView } from 'src/sections/compnay/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new company</title>
      </Helmet>

      <CompanyEditView />
    </>
  );
}
