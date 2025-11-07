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
import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Link } from '@mui/material';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, attachment_name, attachment_type, attachable_primary, attachable_second, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const {
    attachable_id,
    attachable_type,
    attachment_name_id,
    attachment_type_id,
    company_id,
    created_at,
    document_duration_days,
    expiry_date,
    file_path,
    id,
    note_ar,
    note_en,
    release_date,
    status_id
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      {/* <TableCell>{id}</TableCell> */}
      <TableCell>{attachment_name}</TableCell>
      <TableCell>{attachment_type}</TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(release_date)}
          secondary={fDate(expiry_date)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <Link href={`/dashboard/${attachable_type == "car" ? "vehicle":"drivers"}/${attachable_id}`}>
          <ListItemText
            primary={attachable_primary}
            secondary={attachable_second}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </Link>
      </TableCell>
      <TableCell>{document_duration_days} days</TableCell>
      {/* <TableCell>{document_duration_days} </TableCell> */}

      {/* <TableCell>{fDate(expiry_date)}</TableCell> */}

      {/* <TableCell>
        <Avatar
          src={file_path}
          variant="rounded"
          sx={{ width: 48, height: 48 }}
        />
      </TableCell> */}

      {/* <TableCell>
        <Label
          variant="soft"
          color={
            (status_id === 1 && 'success') ||
            (status_id === 2 && 'warning') ||
            (status_id === 3 && 'error') ||
            'default'
          }
        >
          {status_id === 1 ? 'Active' : status_id === 2 ? 'Pending' : 'Expired'}
        </Label>
      </TableCell> */}
    </TableRow>
  );

  // const renderSecondary = (
  //   <TableRow>
  //     <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
  //       <Collapse
  //         in={collapse.value}
  //         timeout="auto"
  //         unmountOnExit
  //         sx={{ bgcolor: 'background.neutral' }}
  //       >
  //         <Stack component={Paper} sx={{ m: 1.5, p: 2 }}>
  //           <ListItemText
  //             primary={`Arabic Note: ${note_ar}`}
  //             secondary={`English Note: ${note_en}`}
  //             primaryTypographyProps={{ typography: 'body2' }}
  //             secondaryTypographyProps={{ typography: 'caption', mt: 0.5 }}
  //           />
  //           <Box>Release Date: {fDate(release_date)}</Box>
  //           <Box>Company ID: {company_id}</Box>
  //         </Stack>
  //       </Collapse>
  //     </TableCell>
  //   </TableRow>
  // );

  return (
    <>
      {renderPrimary}

      {/* {renderSecondary} */}

      <CustomPopover
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this attachment?"
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
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};
