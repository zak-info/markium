import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

// Convert color names to hex codes
const COLOR_NAME_MAP = {
  red: '#FF0000',
  blue: '#0000FF',
  green: '#00FF00',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  grey: '#808080',
  brown: '#A52A2A',
  navy: '#000080',
  teal: '#008080',
  maroon: '#800000',
  olive: '#808000',
  lime: '#00FF00',
  aqua: '#00FFFF',
  silver: '#C0C0C0',
};

const normalizeColor = (color) => {
  if (!color) return '#000000';
  // If already hex, return as is
  if (color.startsWith('#')) return color;
  // If rgb/rgba/hsl, return as is
  if (color.startsWith('rgb') || color.startsWith('hsl')) return color;
  // Convert color name to hex
  const normalized = color.toLowerCase().trim();
  return COLOR_NAME_MAP[normalized] || '#808080';
};

const ColorPicker = forwardRef(
  ({ colors, selected, onSelectColor, limit = 'auto', sx, ...other }, ref) => {
    const singleSelect = typeof selected === 'string';

    const handleSelect = useCallback(
      (color) => {
        if (singleSelect) {
          if (color !== selected) {
            onSelectColor(color);
          }
        } else {
          const newSelected = selected.includes(color)
            ? selected.filter((value) => value !== color)
            : [...selected, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect]
    );

    return (
      <Stack
        ref={ref}
        direction="row"
        display="inline-flex"
        sx={{
          flexWrap: 'wrap',
          ...(limit !== 'auto' && {
            width: limit * 36,
            justifyContent: 'flex-end',
          }),
          ...sx,
        }}
        {...other}
      >
        {colors?.map((color) => {
          const normalizedColor = normalizeColor(color);
          const hasSelected = singleSelect ? selected === color : selected.includes(color);

          return (
            <ButtonBase
              key={color}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
              }}
              onClick={() => {
                handleSelect(color);
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: normalizedColor,
                  borderRadius: '50%',
                  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                  ...(hasSelected && {
                    transform: 'scale(1.3)',
                    boxShadow: `4px 4px 8px 0 ${alpha(normalizedColor, 0.48)}`,
                    outline: `solid 2px ${alpha(normalizedColor, 0.08)}`,
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }),
                }}
              >
                <Iconify
                  width={hasSelected ? 12 : 0}
                  icon="eva:checkmark-fill"
                  sx={{
                    color: (theme) => theme.palette.getContrastText(normalizedColor),
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }}
                />
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>
    );
  }
);

ColorPicker.propTypes = {
  colors: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  limit: PropTypes.number,
  onSelectColor: PropTypes.func,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  sx: PropTypes.object,
};

export default ColorPicker;
