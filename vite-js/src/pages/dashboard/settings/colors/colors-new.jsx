import { Helmet } from 'react-helmet-async';
import ColorsCreateView from 'src/sections/settings/SystemColors/ColorsCreateView';

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
