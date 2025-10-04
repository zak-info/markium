import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function SaasMonthlyRevenue({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.main, theme.palette.warning.main],
    categories,
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}k`,
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {series.map((item) => (
        <Chart
          key={item.year}
          dir="ltr"
          type="column"
          series={item.data}
          options={chartOptions}
          height={364}
        />
      ))}
    </Card>
  );
}

SaasMonthlyRevenue.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
