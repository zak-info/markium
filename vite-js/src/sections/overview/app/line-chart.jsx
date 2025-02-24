import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';
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

export default function AppCurrentDownload({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {  // ✅ Merged `legend` object
      show: true,
      showForSingleSeries: true,
      customLegendItems: [t('paid_claim'), t('severely_overdue_claim'), t('due_claim')],
      offsetY: 0,
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        fillColors: ['#00E396', '#775DD0'],
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    ...options,
  });
  
  const options2 = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },

    goals: [
      {
        name: 'Expected',
        value: 52,
        strokeColor: '#775DD0',
      },
    ],
  };

  const w = [
    {
      name: 'series-1',
      data: [49, 60, 70, 91],
      strokeColor: '#775DD0',
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="bar"
        series={w}
        options={chartOptions}
        width="100%"
        height={350}
      />
    </Card>
  );
}

AppCurrentDownload.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
