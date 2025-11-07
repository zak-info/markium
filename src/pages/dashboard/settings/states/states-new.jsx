import { Helmet } from 'react-helmet-async';
import StatesCreateView from 'src/sections/settings/SystemStates/StatesCreateView';

// ----------------------------------------------------------------------

export default function StatesCreatePage() {
  return (
    <>
      <Helmet>
        <title> System: States Page</title>
      </Helmet>
      <StatesCreateView />
    </>
  );
}
