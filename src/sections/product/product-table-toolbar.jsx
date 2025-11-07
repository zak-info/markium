import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ProductTableToolbar({
  filters,
  onFilters,
  //
  stockOptions,
  publishOptions,
}) {
  const { t } = useTranslate();

  const popover = usePopover();

  const [stock, setStock] = useState(filters.stock || []);

  const [status, setStatus] = useState(filters.status || []);

  useEffect(() => {
    setStock(filters.stock || []);
  }, [filters.stock]);

  useEffect(() => {
    setStatus(filters.status || []);
  }, [filters.status]);

  const handleChangeStock = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setStock(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangeStatus = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setStatus(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleCloseStock = useCallback(() => {
    onFilters('stock', stock);
  }, [onFilters, stock]);

  const handleCloseStatus = useCallback(() => {
    onFilters('status', status);
  }, [onFilters, status]);

  return (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>{t('stock_status')}</InputLabel>

        <Select
          multiple
          value={stock}
          onChange={handleChangeStock}
          input={<OutlinedInput label={t('stock_status')} />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseStock}
          sx={{ textTransform: 'capitalize' }}
        >
          {stockOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={stock.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>{t('status')}</InputLabel>

        <Select
          multiple
          value={status}
          onChange={handleChangeStatus}
          input={<OutlinedInput label={t('status')} />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseStatus}
          sx={{ textTransform: 'capitalize' }}
        >
          {publishOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={status?.includes(option?.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          {t('print')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          {t('import')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          {t('export')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}

ProductTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  publishOptions: PropTypes.array,
  stockOptions: PropTypes.array,
};
