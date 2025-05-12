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
import { useLocales } from 'src/locales';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, onCreateRow, car, action, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { items, status, orderNumber, createdAt, customer, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();
  const days = { ar: "يوم", en: 'day' }
  const { currentLang } = useLocales()

  const renderPrimary = (
    <TableRow hover selected={selected}>
      {/* <TableCell>{car?.plat_number}</TableCell> */}
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
          <ListItemText
            primary={car?.plat_number}
            secondary={car?.model?.translations?.name + " - " + car?.model?.company?.translations?.name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
      </TableCell>


      {/* <TableCell> {row?.id} </TableCell> */}
      <TableCell> {fDate(row?.created_at)} </TableCell>
      <TableCell>{row?.new_values?.remaining_days || t("--")} {row?.new_values?.remaining_days ? days[currentLang.value] : ""}</TableCell>
      <TableCell align="start">{row?.new_values?.maintenance_manager ? row?.new_values?.maintenance_manager[0]?.name : "--"} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row?.action == 'update' && 'primary') ||
            (row?.action == 'create' && 'secondary') ||
            (row?.action === 'action_required' && 'warning') ||
            (row?.action === 'cancelled' && 'error') ||
            'default'
          }
        >
          {action}
        </Label>
      </TableCell>

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

  const renderSecondary = (new_values) => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {/* {new_values ?
              Object.entries(new_values)?.map(([key, value]) => (

                typeof value === "object" && value !== null ?

                  renderSecondary(value)

                  :
                  <Stack
                    key={key}
                    direction="row"
                    alignItems="center"
                    sx={{
                      p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                      '&:not(:last-of-type)': {
                        borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                      },
                    }}
                  >
                    <p>{key} : {value}</p>
                  </Stack>

              ))
              : null
            } */}

          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary(row?.new_values)}

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
        {/* {
          row?.action == 'action_required' && */}
        {
          row?.action !== 'action_required' || !row?.enabled ?
            null
            :
            <PermissionsContext action={"create.maintenance"} >
              <MenuItem
                onClick={() => {
                  onCreateRow();
                  popover.onClose();
                }}
                disabled={row?.action !== 'action_required' || !row?.enabled}
              >
                <Iconify icon="duo-icons:add-circle" />
                {t("create_maintenance")}
              </MenuItem>
            </PermissionsContext>

        }
        {/* } */}


        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t("view")}
        </MenuItem>
      </CustomPopover >

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
