import { Helmet } from 'react-helmet-async';
import MainSpecCreateView from 'src/sections/system_periodic_maintenance/view/main_spec-create-view';


// ----------------------------------------------------------------------

export default function MainSpecCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance Specs Page</title>
      </Helmet>
      <MainSpecCreateView />
    </>
  );
}
