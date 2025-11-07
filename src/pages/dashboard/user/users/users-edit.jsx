import { Container } from '@mui/material';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useShowRole, useShowUser } from 'src/api/users';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import UsersCreateView from 'src/sections/user/Users/UsersCreateView';
import UsersEditView from 'src/sections/user/Users/UsersEditView';
// ----------------------------------------------------------------------

export default function UsersEditPage() {
   const settings = useSettingsContext();
  const params = useParams();

  const { id } = params;
  const { user } = useShowUser(id)

  return (
    <>
     
        <Helmet>
          <title> System: Edit a user</title>
        </Helmet>
        <UsersEditView id={id} currentUser={user} />
    </>
  );
}
