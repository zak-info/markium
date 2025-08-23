import { Card, CardHeader, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function ChartLine({ series, categories, title }) {
  const chartOptions = useChart({
    xaxis: {
      categories: categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    tooltip: {
      x: {
        show: false,
      },
      marker: { show: false },
    },
  });

  return (
    <>
      <Card >
        <CardHeader title={title}  />
        <Chart dir="ltr" type="line" series={series} options={chartOptions} width="100%" height={320} />
      </Card>
    </>
  );
}

ChartLine.propTypes = {
  series: PropTypes.array,
};
