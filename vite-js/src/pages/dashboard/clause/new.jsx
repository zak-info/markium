import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import UserCreateView from 'src/sections/clause/view/user-create-view';



// ----------------------------------------------------------------------

export default function UserCreatePage() {

    const params = useParams();
    
      const { id } = params;
     

  return (
    <>
      <Helmet>
        <title> Dashboard: Add a new Clause</title>
      </Helmet>

      <UserCreateView id={id} />
    </>
  );
}
