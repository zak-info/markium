import { Box, Button } from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import ContentDialog from 'src/components/custom-dialog/content-dialog'
import Iconify from 'src/components/iconify'
import { useBoolean } from 'src/hooks/use-boolean'
import AddClauseForm from './AddClauseForm'
import { fDate } from 'src/utils/format-time'

const AddClause = ({ contract_id, setTableData, contract }) => {

    const confirm = useBoolean();

    const firstPeriod = contract?.periods?.[0];

    const formattedStart = firstPeriod?.start_date ? fDate(firstPeriod.start_date, "dd-MM-yyyy") : "-";
    const formattedEnd = firstPeriod?.end_date ? fDate(firstPeriod.end_date, "dd-MM-yyyy") : "-";

    const description = `${t("must_be_within_period")} : ${formattedStart} - ${formattedEnd}`;


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
                description={description}
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