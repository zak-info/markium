import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';



// ----------------------------------------------------------------------

export default function ProductEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Clause Edit</title>
      </Helmet>

      {/* <UserEditView id={`${id}`} /> */}
    </>
  );
}
