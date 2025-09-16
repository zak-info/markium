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
import padWithZeros from 'src/utils/PadWithZero';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, status, drivers, currentLang, onCreateRow, selected, onViewRow, onSelectRow, onDeleteRow }) {
  console.log("row row row : ",row)
  const { items, orderNumber, createdAt, customer, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>


      {/* <TableCell>{fDate(row.created_at)}</TableCell> */}
      <TableCell>
        <ListItemText
          primary={fDate(row?.created_at)}
          secondary={fDate(row?.created_at)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        <span
          dangerouslySetInnerHTML={{
            __html: row["note_" + currentLang]?.replace(
              /#(\d+)/g,
              (match, id) => {
                const driver = drivers?.find(d => d.id == id); // adjust if your id field is different
                const item = row?.action =="driver_assigned" || row?.action =="driver_removed" ?
                {
                  name:driver?.name,
                  href:"/dashboard/drivers/"+id
                }
                :
                {
                  name:padWithZeros(id,5),
                  href:"/dashboard/maintenance/"+id
                }
                return `<a href=${item?.href} style="color: #00A76F; text-decoration: underline;">${item?.name}</a>`;
              }
            )
          }}
        />
      </TableCell>


    </TableRow>
  );

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
