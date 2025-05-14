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
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { MarkAsCompletedForm } from 'src/sections/maintain/order-table-row';
import { CloseClaim } from './CloseClaim';
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, clausable, onCreateRow, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { items, status, orderNumber, createdAt, customer, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();
  const router = useRouter();
  const completed = useBoolean();


  const handleViewClausable = () => {
    if (row?.clauseable_type == "car") {
      router.push(paths.dashboard.vehicle.details(row?.clauseable_id));
    } else {
      router.push(paths.dashboard.drivers.details(row?.clauseable_id));
    }
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box
          onClick={handleViewClausable}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <ListItemText
            primary={row?.clauseable_type == "car" ? clausable?.model?.translations?.name : clausable?.name}
            secondary={row?.clauseable_type == "car" ? clausable?.plat_number : clausable?.phone_number}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
      </TableCell>
      <TableCell>{row?.cost}.00</TableCell>
      <TableCell>{row?.duration} {row?.duration > 1 ? t("months") : t("month")}</TableCell>
      <TableCell>
        {row?.cost * row?.duration}.00
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

  // const renderSecondary = (new_values) => (
  //   <TableRow>
  //     <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
  //       <Collapse
  //         in={collapse.value}
  //         timeout="auto"
  //         unmountOnExit
  //         sx={{ bgcolor: 'background.neutral' }}
  //       >
  //         <Stack component={Paper} sx={{ m: 1.5 }}>
  //           {/* {new_values ?
  //             Object.entries(new_values)?.map(([key, value]) => (

  //               typeof value === "object" && value !== null ?

  //                 renderSecondary(value)

  //                 :
  //                 <Stack
  //                   key={key}
  //                   direction="row"
  //                   alignItems="center"
  //                   sx={{
  //                     p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
  //                     '&:not(:last-of-type)': {
  //                       borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
  //                     },
  //                   }}
  //                 >
  //                   <p>{key} : {value}</p>
  //                 </Stack>

  //             ))
  //             : null
  //           } */}

  //         </Stack>
  //       </Collapse>
  //     </TableCell>
  //   </TableRow>
  // );

  return (
    <>
      {renderPrimary}

      {/* {renderSecondary(row?.new_values)} */}

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


        <MenuItem
          onClick={() => {
            completed.onTrue();
          }}
        >
          <Iconify icon="duo-icons:folder-open" />
          {t("close_claim")}
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem> */}
      </CustomPopover>

      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("")}
        content={
          <CloseClaim maintenanceId={row?.id} close={() => completed?.onFalse()} />
        }
      />

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
