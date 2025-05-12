import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import ExpandableText from '../maintain/ExpandableText';

// ----------------------------------------------------------------------

export default function OrderTableRow({ TABLE_HEAD, row, unit, pv, currentLang, selected, onSelectRow, actions }) {

  const popover = usePopover();
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align='start' sx={{ width: "100px" }} padding="checkbox" >
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      {TABLE_HEAD.map((head_row, index) => (
        <TableCell key={index}>
          {renderCell(head_row, row, popover)}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        {row?.actions && row?.actions(() => { popover.onClose() })}
      </CustomPopover>


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



function renderCell(head_row, row, popover) {
  switch (head_row.type) {
    case 'text':
      return row?.[head_row.id] || '--';
    case 'long_text':
      return <ExpandableText text={row?.[head_row.id]} /> || '--';

    case 'two-lines':
      return (
        <ListItemText
          primary={row?.[head_row.id]}
          secondary={row?.second_item}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      );

    case 'label':
      return (
        <Label variant={row.variant || 'soft'} color={row.color || 'default'}>
          {row?.[head_row.id]}
        </Label>
      );

    case 'date':
      return fDate(row?.[head_row.id]);

    case 'time':
      return fTime(row?.[head_row.id]);

    case 'link':
      return (
        <MuiLink href={row?.[head_row.id]} color="primary" underline="hover">
          {row?.[head_row.id]}
        </MuiLink>
      );
    case "threeDots":
      return (
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', display: "flex", justifyContent: 'end' }}>
          {head_row?.component(row)}
        </TableCell>
      );
    case 'component':
      return (
        <TableCell align="center" sx={{ whiteSpace: 'nowrap', display: "flex", justifyContent: "end" }}>
          {row?.component}
        </TableCell>
      );

    default:
      return row?.[head_row.id] ?? '--';
  }
}
