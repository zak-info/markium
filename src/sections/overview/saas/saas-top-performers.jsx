import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function SaasTopPerformers({ title, subheader, tableData, tableLabels, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHead>
              <TableRow>
                {tableLabels.map((headLabel) => (
                  <TableCell
                    key={headLabel.id}
                    align={headLabel.align || 'left'}
                    sx={{ width: headLabel.width, minWidth: headLabel.minWidth }}
                  >
                    {headLabel.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((row) => (
                <SaasTopPerformersRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

SaasTopPerformers.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function SaasTopPerformersRow({ row }) {
  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={row.name}
            sx={{
              mr: 2,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
            }}
          >
            <Iconify icon="solar:shop-bold" width={20} />
          </Avatar>

          <Box>
            <Typography variant="subtitle2" noWrap>
              {row.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {row.owner}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>{row.category}</TableCell>

      <TableCell align="center">{row.owner}</TableCell>

      <TableCell align="right">
        <Typography variant="subtitle2" noWrap>
          {fCurrency(row.monthlyRevenue)}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Label
          variant="soft"
          color={row.growth >= 15 ? 'success' : row.growth >= 10 ? 'warning' : 'default'}
        >
          +{row.growth}%
        </Label>
      </TableCell>
    </TableRow>
  );
}

SaasTopPerformersRow.propTypes = {
  row: PropTypes.object,
};
