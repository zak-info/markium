import { Helmet } from 'react-helmet-async';


import ContractCreateView from 'src/sections/clients/view/contract-create-view';

// ----------------------------------------------------------------------

export default function ContractCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Contracts Page</title>
      </Helmet>

      <ContractCreateView />
    </>
  );
}
