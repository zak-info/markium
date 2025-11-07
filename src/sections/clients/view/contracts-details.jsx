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

import ProfileHome from '../profile-home-contracts';
import ProfileCover from '../profile-cover-contracts';
import { useTranslation } from 'react-i18next';
import { useGetContract } from 'src/api/contract';
import { useGetClient } from 'src/api/client';
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

  const {contract} = useGetContract(id);
  const {client} = useGetClient(contract?.client_id);
  const {data} = useValues();

  

  const { t } = useTranslation();

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
        heading={t('contracts')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('contracts'), href: paths.dashboard.clients.contracts },
          { name: t("contract_details")},
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentTab === 'profile' && <ProfileHome info={_userAbout} contract={contract} client={client} location={data?.neighborhoods?.find(item => item?.id==client?.neighborhood_id)} posts={_userFeeds} />}

      {currentTab === 'followers' && <ProfileFollowers followers={_userFollowers} />}

      {/* {currentTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )} */}

      {/* {currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />} */}
    </Container>
  );
}
