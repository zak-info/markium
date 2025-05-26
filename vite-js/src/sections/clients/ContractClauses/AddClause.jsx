import { Box, Button } from '@mui/material'
import { t } from 'i18next'
import React from 'react'
import ContentDialog from 'src/components/custom-dialog/content-dialog'
import Iconify from 'src/components/iconify'
import { useBoolean } from 'src/hooks/use-boolean'
import AddClauseForm from './AddClauseForm'

const AddClause = ({contract_id,setTableData}) => {
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
                content={
                    <>
                        <AddClauseForm setTableData={setTableData} item={{}} id={contract_id} close={() => { confirm.onFalse() }} />
                    </>
                }
            />
        </>
    )
}

export default AddClause