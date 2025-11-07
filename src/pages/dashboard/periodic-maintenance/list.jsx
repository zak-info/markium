import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import PmListView from 'src/sections/vehicles/pm/pm-list-view';



// ----------------------------------------------------------------------

export default function PMListPage() {
  const params = useParams();
  
    const { id } = params;
    console.log("id is :",id);
  return (
    <>
      <Helmet>
        <title> Dashboard: Periodic Maintenance List</title>
      </Helmet>

      <PmListView id={id} />
    </>
  );
}
