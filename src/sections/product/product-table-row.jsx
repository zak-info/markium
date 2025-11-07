import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params, field }) {
  const price = field ? params.row[field] : params.row.sale_price;
  return <>{fCurrency(price)}</>;
}

RenderCellPrice.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
  field: PropTypes.string,
};

export function RenderCellPublish({ params }) {
  return (
    <Label variant="soft" color={(params.row.publish === 'published' && 'info') || 'default'}>
      {params.row.publish}
    </Label>
  );
}

RenderCellPublish.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellCreatedAt({ params }) {
  return (
    <ListItemText
      primary={fDate(params.row.created_at)}
      secondary={fTime(params.row.created_at)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

RenderCellCreatedAt.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellStock({ params }) {
  return (
    <Label variant="soft" color={params.row.is_in_stock ? 'success' : 'error'}>
      {params.row.is_in_stock ? 'In Stock' : 'Out of Stock'}
    </Label>
  );
}

RenderCellStock.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellProduct({ params }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row.images?.[0] || ''}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.description}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

RenderCellProduct.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellDiscount({ params }) {
  const { has_discount, discount_percentage, savings_amount } = params.row;

  if (!has_discount) {
    return <Label variant="soft" color="default">No Discount</Label>;
  }

  return (
    <Stack spacing={0.5}>
      <Label variant="soft" color="success">
        {discount_percentage}% OFF
      </Label>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        Save {fCurrency(savings_amount)}
      </Box>
    </Stack>
  );
}

RenderCellDiscount.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};

export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color={(params.row.status === 'deployed' && 'success') || 'warning'}>
      {params.row.status}
    </Label>
  );
}

RenderCellStatus.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.object,
  }),
};
