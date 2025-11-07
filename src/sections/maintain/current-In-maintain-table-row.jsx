import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Typography } from '@mui/material';
import { useLocales } from 'src/locales';
import { t } from 'i18next';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { MarkAsCompletedForm } from './order-table-row';
import ReleaseCar from './releaseCar';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row,setTableData, maintenance, selected, onViewRow, onEditRow, onSelectRow, onDeleteRow, onViewMaintenance }) {
  const { model, status, plat_number, createdAt, state, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const day = { ar: "يوم", en: 'day' }
  const days = { ar: "ايام", en: 'day' }
  const { currentLang } = useLocales()

  const popover = usePopover();
  const release = useBoolean();
  const completed = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {row?.id}
        </Box>
      </TableCell>
      <TableCell>
        {/* <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {plat_number}
        </Box> */}
        <ListItemText
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          primary={row?.car?.plat_number}
          secondary={row?.car?.model?.company?.translations?.name}
        />
      </TableCell>

      {/* <TableCell> {model?.company?.name} </TableCell> */}

      <TableCell>
        {row?.entry_date ? fDate(row?.entry_date) : '-'}
      </TableCell>
      <TableCell align="center"> {row?.remaining_days ? row?.remaining_days > 2 && row?.remaining_days < 11 ? row?.remaining_days + " " + days[currentLang?.value] : row?.remaining_days + " " + day[currentLang?.value] : "-"} </TableCell>
      {/* <TableCell align="center"> - </TableCell> */}
      <TableCell align="center"> {state?.translations?.name} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (status?.key === 'completed' && 'success') ||
            (status?.key === 'pending' && 'warning') ||
            (status?.key === 'cancelled' && 'error') ||
            'default'
          }
        >
          {/* {status?.translations[0]?.name} */}
          {status?.translations?.name}
        </Label>
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row?.car?.status?.key === 'available' && 'success') ||
            (row?.car?.status?.key === 'under_maintenance' && 'warning') ||
            (row?.car?.status?.key === 'under_preparation' && 'secondary') ||
            'default'
          }
        >
          {/* {status?.translations[0]?.name} */}
          {row?.car?.status?.translations?.name}
        </Label>
      </TableCell>
      <TableCell align="center">{row?.cause}</TableCell>

      {/* <TableCell align="center"> {status?.translations?.name} </TableCell> */}
      {/* <TableCell align="center"> - </TableCell> */}

      {/* <TableCell>-</TableCell> */}

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={12}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5, p: 2 }}>
            <Typography>sssssss</Typography>
            <Typography>sssssss</Typography>
            <Typography>sssssss</Typography>
            <Typography>sssssss</Typography>
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 220 }}
      >
        <MenuItem
          onClick={() => {
            onViewMaintenance(maintenance?.id);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t("view_maintenance")}
        </MenuItem>

        {
          row?.car?.status?.key == "under_maintenance" ?
            <MenuItem
              onClick={() => {
                release.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="lets-icons:sign-out-squre-duotone-line" />
              {t("release_car")}
            </MenuItem>
            :
            row?.car?.status?.key != "under_maintenance" ?
              <MenuItem
                onClick={() => {
                  completed.onTrue();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:pen-bold" />
                {t("mark_as_completed")}
              </MenuItem>
              :
              null
        }


        {/* <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem> */}

        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}


      </CustomPopover>

      <ContentDialog
        open={release.value}
        onClose={release.onFalse}
        title={t("release_car")}
        content={
          <ReleaseCar maintenanceId={row?.id} row={row} setTableData={setTableData} close={() => release?.onFalse()} />
        }
      />
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("are_you_sure")}
        content={
          <MarkAsCompletedForm maintenanceId={row?.id} close={() => completed?.onFalse()} />
        }
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t("delete")}
          </Button>
        }
      />
    </>
  );
}

OrderTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};
