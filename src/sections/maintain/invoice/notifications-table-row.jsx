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
import { STORAGE_API } from 'src/config-global';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, attachement_name,status, onCreateRow, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { items, orderNumber, createdAt, customer, totalQuantity, subTotal } = row;

   const { t } = useTranslate();

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{row?.title}</TableCell>
      <TableCell> <a href={STORAGE_API + "/" + row?.link} target='_blank' ><Label variant="soft" color="success">View</Label></a></TableCell>
      {/* <TableCell><a href={STORAGE_API + "/" + row?.invoice_path} target='_blank' ><Label variant="soft" color="success">View</Label></a></TableCell> */}
      {/* <TableCell>
        <Label
          variant="soft"
          color={
            (row?.status?.key === 'not_yet_attachment' && 'success') ||
            (row?.status?.key === 'soon_attachment' && 'warning') ||
            (row?.status?.key === 'late_attachment' && 'error') ||
            (row?.status?.key === 'too_late_attachment' && 'secondary') ||
            'default'
          }
        >
          {row?.status?.translations[0]?.name}
        </Label>
      </TableCell> */}

      <TableCell align="start" sx={{ px: 1 }}>
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

  
  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 190 }}
      >
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
        {
          row?.action == 'action_required' &&
          <MenuItem
            onClick={() => {
              onCreateRow();
              popover.onClose();
            }}
          >
            <Iconify icon="duo-icons:add-circle" />
            create maintenance
          </MenuItem>
        }


        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

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
