import { Container } from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'
import { useSettingsContext } from 'src/components/settings'

const ZaityHeadContainer = ({ children, heading, links, action }) => {
      const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t(heading)}
                links={links}
                action={
                    <>
                        {action}
                    </>
                }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            {children}
        </Container>
    )
}

export default ZaityHeadContainer