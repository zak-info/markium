import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  IconButton,
  MenuItem,
  Stack,
} from '@mui/material';

import Chart, { useChart } from 'src/components/chart';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { fNumber } from 'src/utils/format-number';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppCurrentDownload({
  title,
  subheader,
  chart,
  labels,
  handleThisWeek,
  handleThisMonth,
  handleThisYear,
  ...other
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const popover = usePopover();

  const { colors, series, options } = chart;

  // Bar values (y-axis length)
  const chartSeries = [
    {
      name: t('item'),
      data: series.map((item) => item.value),
    },
  ];

  const chartOptions = useChart({
    colors, // bar colors
    labels: series.map((item) => item.label),
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true, // ✅ respect colors by bar
        borderRadius: 4,
        barHeight: '75%',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme.palette.text.primary],
      },
    },
    legend: {
      show: true,
      customLegendItems: series.map((item) => item.label),
      markers: {
        fillColors: colors,
      },
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="bar"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={350}
      />

      <Stack direction="row" justifyContent="flex-end">
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            handleThisWeek();
            popover.onClose();
          }}
        >
          {t('this_week')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleThisMonth();
            popover.onClose();
          }}
        >
          {t('this_month')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleThisYear();
            popover.onClose();
          }}
        >
          {t('this_year')}
        </MenuItem>
      </CustomPopover>
    </Card>
  );
}

AppCurrentDownload.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chart: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number,
      })
    ),
    options: PropTypes.object,
  }),
  labels: PropTypes.array,
  handleThisWeek: PropTypes.func,
  handleThisMonth: PropTypes.func,
  handleThisYear: PropTypes.func,
};
