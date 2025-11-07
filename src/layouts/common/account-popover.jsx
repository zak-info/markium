import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { useAuthContext } from 'src/auth/hooks';

import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: t('home'),
    linkTo: '/dashboard',
  },
  // {
  //   label: t('profile'),
  //   linkTo: paths.dashboard.user.profile,
  // },
  // {
  //   label: 'Settings',
  //   linkTo: paths.dashboard.user.account,
  // },
];

import { useContext } from 'react';
import { AuthContext } from 'src/auth/context/jwt';
import { t } from 'i18next';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import ChangePasswordView from 'src/sections/user/Users/changePasswordView';
import { useBoolean } from 'src/hooks/use-boolean';
// import { AuthContext } from 'path-to-auth-context/auth-context'; // Adjust the path accordingly


// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  console.log("user : ", user);
  // const { user } = useMockedUser();


  const { logout } = useAuthContext();

  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();
  const complete = useBoolean()

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/auth/jwt/login');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  const handleCopyStoreUrl = () => {
    const storeUrl = `https://${user?.store?.slug}.markium.online`;
    navigator.clipboard.writeText(storeUrl)
      .then(() => {
        enqueueSnackbar(t('store_url_copied'), { variant: 'success' });
        popover.onClose();
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        enqueueSnackbar(t('failed_to_copy'), { variant: 'error' });
      });
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.photoURL}
          alt={user?.name}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.phone}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
          {/* <MenuItem key={"change_password"} onClick={() => {complete.onTrue(); popover.onClose()}}>
            {t("edit_password")}
          </MenuItem> */}
          <MenuItem
            onClick={handleCopyStoreUrl}
          >
            {/* <Iconify icon="solar:copy-bold" sx={{ mr: 1 }} /> */}
            {t('copy_store_url')}
          </MenuItem>
        </Stack>

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}


        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          {t("logout")}
        </MenuItem>
      </CustomPopover>
      <ContentDialog

        open={complete.value}
        onClose={complete.onFalse}
        title={t("edit_password")}
        content={
          <ChangePasswordView selfAccount={true} currentUser={user} onClose={() => { complete.onFalse() }} />
        }
      />
    </>
  );
}
