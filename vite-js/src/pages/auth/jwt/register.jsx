import { Helmet } from 'react-helmet-async';

import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Markium: Register</title>
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
