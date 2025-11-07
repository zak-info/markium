import { Container, Grid } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetAllClaim } from 'src/api/claim';
import { useGetClients } from 'src/api/client';
import { useGetContracts } from 'src/api/contract';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import ContractClaimsListView from 'src/sections/clients/ContractClaimsTable/ContractClaimsListView';


import { ClaimsListView } from 'src/sections/clients/view';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  const settings = useSettingsContext();
  const { claims,claimsLoading } = useGetAllClaim()
  const { clients } = useGetClients()
  const { contracts } = useGetContracts()
  console.log("clients : ", clients?.find(item => item?.id == 1));
  console.log("contracts : ", contracts?.find(item => item?.id == 1));


  const formulateClaims = (list) => {
    return list.map((item) => {
      const contract = contracts?.find((c) => c.id === item?.contract_id);
      const client = clients?.find((cl) => cl.id === contract?.client_id);

      return {
        ...item,
        payment_date: fDate(new Date(item?.paiment_date)),
        date: fDate(new Date(item?.created_at)),
        gstatus: item?.status?.translations?.[0]?.name,
        contract: contract?.ref,
        client: client?.name,
        client_id: client?.id,
      };
    });
  };
  


  const [data, setDate] = useState(formulateClaims(claims));
  useEffect(() => {
    setDate(formulateClaims(claims))
  }, [claims,clients,contracts])

  return (
    <>
      <Helmet>
        <title> Dashboard: Claims Page</title>
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('claims')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('clients'), href: paths.dashboard.clients.contracts },
            { name: t("claims") },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {/* <Grid container spacing={3}> */}
        {/* <ClaimsListView /> */}
        <Grid display={"flex"} flexDirection={"column"} rowGap={4} xs={12} md={12}>
          <ContractClaimsListView claimsLoading={claimsLoading} data={data} with_contracts={true} />
        </Grid>
        {/* </Grid> */}
      </Container>
    </>
  );
}
