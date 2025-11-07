import { Helmet } from 'react-helmet-async';
import ClaimCreateView from 'src/sections/clients/view/claim-create-view';


// ----------------------------------------------------------------------

export default function ClaimCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Claims Page</title>
      </Helmet>

      <ClaimCreateView />
    </>
  );
}
