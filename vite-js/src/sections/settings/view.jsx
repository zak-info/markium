import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import { RoleBasedGuard } from 'src/auth/guard';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { t } from 'i18next';
import { Divider, Link } from '@mui/material';
import Iconify from 'src/components/iconify';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';

// ----------------------------------------------------------------------

export default function SettingsView() {
  const settings = useSettingsContext();

  const [role, setRole] = useState('admin');

  const groups = [
    {
      title: "vehicles", icon: "duo-icons:car",
      items: [
        { type: "maintenance_specification", header: "periodic_maintenances", subheader: "add_and_edit_periodic_maintenances", href: paths?.dashboard.settings.pm },
        { type: "color", header: "colors", subheader: "add_and_edit_colors", href: paths?.dashboard.settings.colors },
        { type: "car_model", header: "car_models", subheader: "add_and_edit_car_models", href: paths?.dashboard.settings.car_models },
        { type: "car_company", header: "car_companies", subheader: "add_and_edit_car_companies", href: paths?.dashboard.settings.car_companies },
        { type: "spec", header: "specs", subheader: "add_and_edit_specs", href: paths?.dashboard.settings.specs },
        { type: "license_type", header: "license_types", subheader: "add_and_edit_license_types", href: paths?.dashboard.settings.license_types },
      ]
    },
    {
      title: "locations", icon: "duo-icons:location",
      items: [
        { type: "neighborhood", header: "neighborhoods", subheader: "add_and_edit_neighborhood", href: paths?.dashboard.settings.neighborhoods },
        { type: "state", header: "states", subheader: "add_and_edit_states", href: paths?.dashboard.settings.states },
        { type: "country", header: "countries", subheader: "add_and_edit_countries", href: paths?.dashboard.settings.countries },
      ]
    },
    {
      title: "files", icon: "duo-icons:upload-file",
      items: [
        { type: "attachment_name", header: "documents_types", subheader: "add_and_edit_documents", href: paths?.dashboard.settings.attachment_names },
      ]
    },
    {
      title: "contracts", icon: "duo-icons:message-3",
      items: [
        { type: "payment_method", header: "payment_methods", subheader: "add_and_edit_payment_methods", href: paths?.dashboard.settings.payment_methods },
      ]
    },
  ]


  const handleChangeRole = useCallback((event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("system_settings")}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t("system_settings"),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <ToggleButtonGroup
        exclusive
        value={role}
        size="small"
        onChange={handleChangeRole}
        sx={{ mb: 5 }}
      >
        <ToggleButton value="admin" aria-label="admin role">
          isAdmin
        </ToggleButton>

        <ToggleButton value="user" aria-label="user role">
          isUser
        </ToggleButton>
      </ToggleButtonGroup> */}

      <RoleBasedGuard hasContent roles={[role]} sx={{ py: 10 }}>
        {
          groups?.map((group, index) => (
            <>
              {index > 0 && <Divider orientation="horizontal" sx={{ mt: 4, display: 'flex' }} />}
              <Typography variant="h4" sx={{ mb: 2, mt: 2, display: "flex", alignItems: "center" }} >
                <Iconify icon={group?.icon} width="40px" height="40px" sx={{ mx: 1 }} style={{ color: "#00A76F" }} />
                {t(group?.title)}
              </Typography>
              <Box gap={3} display="grid" gridTemplateColumns="repeat(3, 1fr)">
                {
                  group.items?.map((item, index2) => (
                    <PermissionsContext action={"read."+item?.type} >
                      <Card key={index2} sx={{ pb: 2 }}>
                        <CardHeader title={t(item?.header)} subheader={<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>{t(item?.subheader)}<Link href={item?.href} sx={{ fontSize: "0.7rem" }}><Iconify icon="tabler:arrow-narrow-left" width="32px" height="32px" style={{ color: "#00A76F" }} /></Link></Box>} />
                      </Card>
                    </PermissionsContext>
                  ))
                }
              </Box>
            </>
          ))
        }

        {/* <Card >
          <CardHeader title={<p>{t(`colors`)} <Link href={paths?.dashboard.settings.colors} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_colors`)} /> */}
        {/* <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`colors_paragraph`)}
            </Typography> */}
        {/* </Card>
        <Card >
          <CardHeader title={<p>{t(`car_models`)} <Link href={paths?.dashboard.settings.car_models} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_car_models`)} /> */}
        {/* <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`car_models_paragraph`)}
            </Typography> */}
        {/* </Card>
        <Card sx={{ pb: 5 }} >
          <CardHeader title={<p>{t(`car_companies`)} <Link href={paths?.dashboard.settings.car_companies} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_car_companies`)} /> */}
        {/* <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`car_companies_paragraph`)}
            </Typography> */}
        {/* </Card>
        <Card >
          <CardHeader title={<p>{t(`specs`)} <Link href={paths?.dashboard.settings.specs} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_specs`)} /> */}
        {/* <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`specs_paragraph`)}
            </Typography> */}
        {/* </Card>
        <Card >
          <CardHeader title={<p>{t(`license_types`)} <Link href={paths?.dashboard.settings.license_types} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_license_types`)} /> */}
        {/* <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`license_types_paragraph`)}
            </Typography> */}
        {/* </Card> */}


        {/* <Divider orientation="horizontal" sx={{ mt: 4 }} />
        <Typography variant="h4" sx={{ mb: 2, mt: 2 }} >
          {t('locations')}
        </Typography>
        <Box gap={3} display="grid" gridTemplateColumns="repeat(3, 1fr)">
          <Card >
            <CardHeader title={<p>{t(`neighborhoods`)} <Link href={paths?.dashboard.settings.neighborhoods} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_neighborhood`)} />
            <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`neighborhood_paragraph`)}
            </Typography>
          </Card>
          <Card >
            <CardHeader title={<p>{t(`states`)} <Link href={paths?.dashboard.settings.states} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_states`)} />
            <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`states_paragraph`)}
            </Typography>
          </Card>
          <Card >
            <CardHeader title={<p>{t(`countries`)} <Link href={paths?.dashboard.settings.countries} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_countries`)} />
            <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`countries_paragraph`)}
            </Typography>
          </Card>

        </Box>
        <Divider orientation="horizontal" sx={{ mt: 10 }} />
        <Typography variant="h4" sx={{ mb: 10, mt: 2 }} >
          {t('files')}
        </Typography>
        <Box gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          <Card >
            <CardHeader title={<p>{t(`documents_types`)} <Link href={paths?.dashboard.settings.attachment_names} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_documents`)} />
            <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`documents_paragraph`)}
            </Typography>
          </Card>

        </Box>
        <Divider orientation="horizontal" sx={{ mt: 10 }} />
        <Typography variant="h4" sx={{ mb: 10, mt: 2 }} >
          {t('contracts')}
        </Typography>
        <Box gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          <Card >
            <CardHeader title={<p>{t(`payment_methods`)} <Link href={paths?.dashboard.settings.payment_methods} sx={{ fontSize: "0.7rem" }}>{t(`edit`)}</Link></p>} subheader={t(`add_and_edit_payment_methods`)} />
            <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`payment_methods_paragraph`)}
            </Typography>
          </Card>


        </Box> */}
      </RoleBasedGuard>
    </Container>
  );
}
