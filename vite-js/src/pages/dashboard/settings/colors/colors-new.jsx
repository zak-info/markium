import { Helmet } from 'react-helmet-async';
import ColorsCreateView from 'src/sections/settings/SystemColors/ColorsCreateView';
import StatesCreateView from 'src/sections/settings/SystemStates/StatesCreateView';

// ----------------------------------------------------------------------

export default function StatesCreatePage() {
  return (
    <>
      <Helmet>
        <title> System: Colors Page</title>
      </Helmet>
      <ColorsCreateView />
    </>
  );
}
