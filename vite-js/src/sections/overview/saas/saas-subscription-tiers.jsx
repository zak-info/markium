import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function SaasSubscriptionTiers({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const {
    colors = [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
    ],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors,
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => `${value}%`,
        title: {
          formatter: (seriesName) => `${seriesName}: `,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        dir="ltr"
        type="pie"
        series={series.map((item) => item.value)}
        options={chartOptions}
        height={240}
      />
    </Card>
  );
}

SaasSubscriptionTiers.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
