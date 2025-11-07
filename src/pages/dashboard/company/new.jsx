import { Helmet } from 'react-helmet-async';

import { CompanyNewView } from 'src/sections/compnay/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new company</title>
      </Helmet>

      <CompanyNewView />
    </>
  );
}
