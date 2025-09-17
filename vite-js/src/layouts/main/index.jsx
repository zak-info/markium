import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { useRouter, usePathname } from 'src/routes/hooks';

import Footer from './footer';
import Header from './header';

import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const homePage = pathname === '/';

  const check = useCallback(() => {
    if (authenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/');
    }
  }, [authenticated]);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      {/* <Header /> */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!homePage && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};
