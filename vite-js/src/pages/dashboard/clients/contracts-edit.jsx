import { Helmet } from 'react-helmet-async';


import ContractCreateView from 'src/sections/clients/view/contract-create-view';
import { useParams } from 'react-router';

// ----------------------------------------------------------------------

export default function ContractCreatePage() {

  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Contracts Page</title>
      </Helmet>

      <ContractCreateView  id={id} />
    </>
  );
}
