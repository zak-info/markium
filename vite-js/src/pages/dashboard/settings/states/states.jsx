import { Helmet } from 'react-helmet-async';
import StateListView from 'src/sections/settings/SystemStates/StateListView';
// ----------------------------------------------------------------------

export default function StatesListPage() {
  return (
    <>
      <Helmet>
        <title> Settings: States Page</title>
      </Helmet>

      <StateListView />
    </>
  );
}
