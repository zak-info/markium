import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import Chart, { useChart } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';

// Mock data for testing
const mockCarsData = [
  { id: 1, plate: 'ABC-123', model: 'Toyota Camry', status: 'available', driver: 'John Doe', lastMaintenance: '2024-01-15' },
  { id: 2, plate: 'XYZ-789', model: 'Honda Civic', status: 'rented', driver: 'Jane Smith', lastMaintenance: '2024-01-10' },
  { id: 3, plate: 'DEF-456', model: 'Ford Focus', status: 'maintenance', driver: 'Mike Johnson', lastMaintenance: '2024-01-20' },
  { id: 4, plate: 'GHI-789', model: 'Nissan Altima', status: 'available', driver: 'Sarah Wilson', lastMaintenance: '2024-01-12' },
];

const mockDriversData = [
  { id: 1, name: 'John Doe', license: 'DL-001', status: 'active', experience: '5 years', rating: 4.8 },
  { id: 2, name: 'Jane Smith', license: 'DL-002', status: 'active', experience: '3 years', rating: 4.6 },
  { id: 3, name: 'Mike Johnson', license: 'DL-003', status: 'inactive', experience: '7 years', rating: 4.9 },
  { id: 4, name: 'Sarah Wilson', license: 'DL-004', status: 'active', experience: '2 years', rating: 4.4 },
];

const mockClientsData = [
  { id: 1, name: 'ABC Company', contact: 'John Manager', email: 'john@abc.com', status: 'active', contracts: 5 },
  { id: 2, name: 'XYZ Corp', contact: 'Jane Director', email: 'jane@xyz.com', status: 'active', contracts: 3 },
  { id: 3, name: 'DEF Ltd', contact: 'Mike CEO', email: 'mike@def.com', status: 'inactive', contracts: 2 },
  { id: 4, name: 'GHI Inc', contact: 'Sarah VP', email: 'sarah@ghi.com', status: 'active', contracts: 7 },
];

const mockContractsData = [
  { id: 1, client: 'ABC Company', vehicle: 'ABC-123', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active', value: 50000 },
  { id: 2, client: 'XYZ Corp', vehicle: 'XYZ-789', startDate: '2024-02-01', endDate: '2024-11-30', status: 'active', value: 45000 },
  { id: 3, client: 'DEF Ltd', vehicle: 'DEF-456', startDate: '2023-12-01', endDate: '2024-11-30', status: 'expired', value: 60000 },
  { id: 4, client: 'GHI Inc', vehicle: 'GHI-789', startDate: '2024-03-01', endDate: '2025-02-28', status: 'active', value: 55000 },
];

const mockMaintenanceData = [
  { id: 1, vehicle: 'ABC-123', type: 'Regular Service', date: '2024-01-15', cost: 500, status: 'completed' },
  { id: 2, vehicle: 'XYZ-789', type: 'Oil Change', date: '2024-01-10', cost: 150, status: 'completed' },
  { id: 3, vehicle: 'DEF-456', type: 'Brake Repair', date: '2024-01-20', cost: 800, status: 'in-progress' },
  { id: 4, vehicle: 'GHI-789', type: 'Tire Replacement', date: '2024-01-12', cost: 400, status: 'scheduled' },
];

const mockClaimsData = [
  { id: 1, client: 'ABC Company', amount: 2500, date: '2024-01-15', status: 'pending', type: 'Accident' },
  { id: 2, client: 'XYZ Corp', amount: 1800, date: '2024-01-10', status: 'approved', type: 'Damage' },
  { id: 3, client: 'DEF Ltd', amount: 3200, date: '2024-01-20', status: 'rejected', type: 'Theft' },
  { id: 4, client: 'GHI Inc', amount: 1500, date: '2024-01-12', status: 'pending', type: 'Accident' },
];

// Chart data
const getChartData = () => {
  const carsByStatus = mockCarsData.reduce((acc, car) => {
    acc[car.status] = (acc[car.status] || 0) + 1;
    return acc;
  }, {});

  const driversByStatus = mockDriversData.reduce((acc, driver) => {
    acc[driver.status] = (acc[driver.status] || 0) + 1;
    return acc;
  }, {});

  const contractsByStatus = mockContractsData.reduce((acc, contract) => {
    acc[contract.status] = (acc[contract.status] || 0) + 1;
    return acc;
  }, {});

  return {
    cars: {
      series: Object.values(carsByStatus),
      labels: Object.keys(carsByStatus).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
      colors: ['#00AB55', '#FFC107', '#FF4842'],
    },
    drivers: {
      series: Object.values(driversByStatus),
      labels: Object.keys(driversByStatus).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
      colors: ['#00AB55', '#FF4842'],
    },
    contracts: {
      series: Object.values(contractsByStatus),
      labels: Object.keys(contractsByStatus).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
      colors: ['#00AB55', '#FFC107', '#FF4842'],
    },
  };
};

const Dashboard = () => {
  const settings = useSettingsContext();
  const [activeTab, setActiveTab] = useState(0);
  const chartData = getChartData();

  // Pre-calculate chart options to avoid calling useChart in render functions
  const carsChartOptions = useChart({
    labels: chartData.cars.labels,
    colors: chartData.cars.colors,
    legend: { position: 'bottom' },
  });

  const driversChartOptions = useChart({
    labels: chartData.drivers.labels,
    colors: chartData.drivers.colors,
    legend: { position: 'bottom' },
  });

  const contractsChartOptions = useChart({
    labels: chartData.contracts.labels,
    colors: chartData.contracts.colors,
    legend: { position: 'bottom' },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderCarsDriversClientsTab = () => (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Platform Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Cars Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Vehicles by Status
              </Typography>
              <Chart
                type="donut"
                series={chartData.cars.series}
                options={carsChartOptions}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Drivers Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Drivers by Status
              </Typography>
              <Chart
                type="pie"
                series={chartData.drivers.series}
                options={driversChartOptions}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Vehicles
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {mockCarsData.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Drivers
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {mockDriversData.filter(d => d.status === 'active').length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Clients
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {mockClientsData.filter(c => c.status === 'active').length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Tables */}
      <Grid container spacing={3}>
        {/* Cars Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Vehicles
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Plate</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Driver</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCarsData.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>{car.plate}</TableCell>
                        <TableCell>{car.model}</TableCell>
                        <TableCell>
                          <Chip
                            label={car.status}
                            color={
                              car.status === 'available' ? 'success' :
                              car.status === 'rented' ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{car.driver}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Drivers Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Drivers
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>License</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockDriversData.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.license}</TableCell>
                        <TableCell>
                          <Chip
                            label={driver.status}
                            color={driver.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{driver.rating}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Clients Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Clients
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Contracts</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockClientsData.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.contact}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={client.status}
                            color={client.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{client.contracts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderContractsMaintenanceClaimsTab = () => (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Business Operations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Contracts Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contracts by Status
              </Typography>
              <Chart
                type="donut"
                series={chartData.contracts.series}
                options={contractsChartOptions}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Financial Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      ${fNumber(mockContractsData.reduce((sum, c) => sum + c.value, 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Contract Value
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      ${fNumber(mockMaintenanceData.reduce((sum, m) => sum + m.cost, 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Maintenance Cost
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      ${fNumber(mockClaimsData.reduce((sum, c) => sum + c.amount, 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Claims Amount
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {mockContractsData.filter(c => c.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Contracts
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Tables */}
      <Grid container spacing={3}>
        {/* Contracts Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contracts
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockContractsData.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell>{contract.client}</TableCell>
                        <TableCell>{contract.vehicle}</TableCell>
                        <TableCell>
                          <Chip
                            label={contract.status}
                            color={
                              contract.status === 'active' ? 'success' :
                              contract.status === 'expired' ? 'error' : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${fNumber(contract.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Maintenance
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockMaintenanceData.map((maintenance) => (
                      <TableRow key={maintenance.id}>
                        <TableCell>{maintenance.vehicle}</TableCell>
                        <TableCell>{maintenance.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={maintenance.status}
                            color={
                              maintenance.status === 'completed' ? 'success' :
                              maintenance.status === 'in-progress' ? 'warning' : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${fNumber(maintenance.cost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Claims Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Claims
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockClaimsData.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.client}</TableCell>
                        <TableCell>{claim.type}</TableCell>
                        <TableCell>${fNumber(claim.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={claim.status}
                            color={
                              claim.status === 'approved' ? 'success' :
                              claim.status === 'rejected' ? 'error' : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{claim.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          sx={{ '& .MuiTab-root': { minHeight: 64 } }}
        >
          <Tab label="Platform Overview" />
          <Tab label="Business Operations" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderCarsDriversClientsTab()}
      {activeTab === 1 && renderContractsMaintenanceClaimsTab()}
    </Container>
  );
};

export default Dashboard; 