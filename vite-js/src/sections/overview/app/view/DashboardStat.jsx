import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useSettingsContext } from 'src/components/settings';
import { Container } from '@mui/material';
import { OverviewAppView } from '.';


const DashboardStat = () => {
    const settings = useSettingsContext();
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                {/* <Box sx={{}}> */}
                 <Box display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }} sx={{px:8}}>
                    <TabContext color="primary" value={value} >
                        <Box  sx={{ width:"300px",borderBottom: 1, borderColor: 'divider' }}>
                            <TabList  textColor="primary" indicatorColor="primary"  sx={{width:"400px"}} onChange={handleChange} aria-label="lab API tabs example">
                                <Tab color='primary' label="Item One" value="1" />
                                <Tab label="Item Two" value="2" />
                                <Tab label="Item Three" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <OverviewAppView />
                        </TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Box>
            </Container>
        </>
    )
}

export default DashboardStat