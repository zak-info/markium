import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { fDate } from 'src/utils/format-time';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useValues } from 'src/api/utils';
import { Link } from 'react-router-dom';
import { STORAGE_API } from 'src/config-global';
import { useEffect } from 'react';
import { paths } from 'src/routes/paths';
import { t } from 'i18next';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import { useBoolean } from 'src/hooks/use-boolean';
import { Typography } from '@mui/material';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { EditODO } from '../vehicles/EditODO';
import AddDocumentToDriver from './DriverListView/AddDocumentToDriver';

// ----------------------------------------------------------------------

export default function AppNewInvoice({ driver, title, subheader, tableData, tableLabels, ...other }) {
  const { data } = useValues()
  const completed = useBoolean()
  return (
    <>
      <Card {...other}>
        <CardHeader sx={{ mb: 3 }} title={
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
            <Typography >
              {title}
            </Typography>
            <PermissionsContext action={'put.car.odometer'}>
              <Button onClick={() => { completed.onTrue() }} color="inherit" variant="contained" startIcon={<Iconify icon="solar:cloud-file-bold-duotone" />}>
                {t("add")}
              </Button>
            </PermissionsContext>
          </Box>
        }
          subheader={subheader} />
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{}}>
              <TableHeadCustom headLabel={tableLabels} />
              <TableBody>
                {tableData?.map((row) => (
                  <AppNewInvoiceRow attachement_name={data?.attachmenat_names?.find(item => item.id == row.attachment_name_id)?.translations[0]?.name} key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <ContentDialog
          maxWidth={"md"}
          open={completed.value}
          onClose={completed.onFalse}
          title={t("addNewDocument")}

          content={
            <AddDocumentToDriver driver_id={driver.id} close={() => completed?.onFalse()} />
          }
        />
      </Card>
    </>
  );
}

AppNewInvoice.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AppNewInvoiceRow({ row, attachement_name }) {
  const popover = usePopover();

  useEffect(() => {
    console.log(STORAGE_API + "/" + row?.attachment_path);
    console.log(STORAGE_API + "/" + row?.invoice_path);
  }, [])

 

  return (
    <>
      <TableRow>
        <TableCell>{attachement_name}</TableCell>

        <TableCell>
          {row?.attachment_path ?
            <a href={paths.dashboard.documents.preview + `?url=${"/" + row?.attachment_path}`} target='_blank'><Label variant="soft" color="success">{t("preview")}</Label></a>
            :
            "--"}
        </TableCell>
        <TableCell>
          {row?.invoice_path ?
            <a href={paths.dashboard.documents.preview + `?url=${"/" + row?.invoice_path}`} target='_blank'><Label variant="soft" color="success">{t("preview")}</Label></a>
            :
            "--"
          }
        </TableCell>
      </TableRow>

    </>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};
