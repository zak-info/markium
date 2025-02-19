import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';
import { useTranslation } from 'react-i18next';
import { useGetClient, useGetClients } from 'src/api/client';
import { useValues } from 'src/api/utils';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView({id}) {
  const settings = useSettingsContext();

  const { user } = useMockedUser();

  const { t } = useTranslation();
  const {client} = useGetClient(id)
  const {data} = useValues()

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('client')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('clients'), href: paths.dashboard.drivers.root },
          { name: client?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={data?.neighborhoods?.find(item => item?.id == client?.neighborhood_id)?.translations[0]?.name}
          name={client?.name}
          avatarUrl={user?.photoURL}
          coverUrl={_userAbout.coverUrl}
        />

      </Card> */}

      {currentTab === 'profile' && <ProfileHome info={client} posts={_userFeeds} />}

      {/* {currentTab === 'followers' && <ProfileFollowers followers={_userFollowers} />} */}
      </Container>
  );
}
