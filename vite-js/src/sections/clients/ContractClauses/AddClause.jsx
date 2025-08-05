import { Box, Button } from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import ContentDialog from 'src/components/custom-dialog/content-dialog'
import Iconify from 'src/components/iconify'
import { useBoolean } from 'src/hooks/use-boolean'
import AddClauseForm from './AddClauseForm'
import { fDate } from 'src/utils/format-time'

const AddClause = ({contract_id,setTableData , contract}) => {
    const confirm = useBoolean();
    return (
        <>
            <Box display={"flex"} my={4} justifyContent={"end"}  >
                <Button
                    onClick={() => {
                        confirm.onTrue()
                    }}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    {t("addClause")}
                </Button>
            </Box>
            <ContentDialog
                maxWidth={"md"}
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t("addClause")}
                description={t("must_be_within_period")+" : "+fDate(contract?.periods[0]?.start_date , "dd-MM-yyyy")+" - "+fDate(contract?.periods[0]?.end_date, "dd-MM-yyyy")}
                content={
                    <>
                        <AddClauseForm contract={contract} setTableData={setTableData} item={{}} id={contract_id} close={() => { confirm.onFalse() }} />
                    </>
                }
            />
        </>
    )
}

export default AddClause