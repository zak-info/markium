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
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, car, currentLang, status, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { items, orderNumber, action, created_at, note_en, updated_at, createdAt, customer, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}


      <TableCell>
        <ListItemText
          primary={car?.plat_number}
          secondary={car?.model?.company?.translations?.name + " " + car?.model?.translations?.name}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={fDate(created_at)}
          secondary={fTime(created_at)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (status?.key === 'create' && 'default') ||
            (status?.key === 'notification' && 'success') ||
            (status?.key === 'update' && 'secondary') ||
            (status?.key === 'status_switch' && 'warning') ||
            (status?.key === 'cancelled' && 'error') ||
            'default'
          }
        >
          {status?.translations[0]?.name}
        </Label>
      </TableCell>



      {/* <TableCell> {fCurrency(subTotal)} </TableCell> */}
      <TableCell> {row["note_" + currentLang]} </TableCell>

      <TableCell align="end" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            <Stack
              key={"1"}
              direction="row"
              alignItems="center"
              sx={{
                p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                '&:not(:last-of-type)': {
                  borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                },
              }}
            >
              <Box sx={{ width: 160, color: 'text.secondary' }}>{t("note")}</Box>
              <Box sx={{ typography: 'subtitle2' }}>{row["note_" + currentLang]}</Box>
            </Stack>
            {row?.new_values ?
              [{ value: "vin", lable: "vin" }, { value: "created_at", lable: "created_at" }, { value: "plat_number", lable: "plateNumber" }, { value: "chassis_number", lable: "chassis_number" }, { value: "production_year", lable: "manufacturingYear" }, { value: "passengers_capacity", lable: "numberOfPassengers" }].map((item, index) => (
                !!row?.new_values[item?.value] ?
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    sx={{
                      p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                      '&:not(:last-of-type)': {
                        borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                      },
                    }}
                  >
                    <Box sx={{ width: 160, color: 'text.secondary' }}>{t(item?.lable)}</Box>
                    <Box sx={{ typography: 'subtitle2' }}>{row?.new_values[item?.value]}</Box>
                  </Stack>
                  :
                  null
              ))
              :
              null
            }
          </Stack>

        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover> */}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
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
