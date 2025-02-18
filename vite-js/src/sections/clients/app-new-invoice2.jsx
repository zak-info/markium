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

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useGetCar } from 'src/api/car';
import { useGetDrivers } from 'src/api/drivers';
import { ListItemText } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useGetClaim } from 'src/api/claim';
import { useEffect, useState } from 'react';
import { fDate } from 'src/utils/format-time';
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function AppNewInvoice2({ title, subheader,tableData,contract_id, tableLabels, ...other }) {
  // const { claims } = useGetClaim();

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData?.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row}  />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          {t("view_all")}
        </Button>
      </Box>
    </Card>
  );
}

AppNewInvoice2.propTypes = {
  subheader: PropTypes.string,
  claims: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AppNewInvoiceRow({row,clausable}) {
  const popover = usePopover();
  const router = useRouter();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };
  const handleViewClausable = () => {
    console.log(row);
    if(row?.clauseable_type == "car"){
      router.push(paths.dashboard.vehicle.details(row?.clauseable_id));
    }else{
      router.push(paths.dashboard.drivers.details(row?.clauseable_id));
    }
    console.info('DELETE', row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {row?.amount}
        </TableCell>

        <TableCell>{fDate(row?.created_at)}</TableCell>

        <TableCell>{fDate(row?.paiment_date)}</TableCell>

        <TableCell>
            {row?.status?.translations[0]?.name}
        </TableCell>

        {/* <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};
