import React from "react";
import { Button, Chip, IconButton } from "@mui/material";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import { useBoolean } from "src/hooks/use-boolean";
import { usePopover } from "src/components/custom-popover";
import ContentDialog from "src/components/custom-dialog/content-dialog";
import EditExitDate from "./EditExitDate";
import Iconify from "src/components/iconify";
import MultiFilePreview from "src/components/upload/preview-multi-invoices";
import { normalizeInvoices } from "src/components/file-thumbnail";

const ShowInvoices = ({ invoices, date, setCurrentMentainance }) => {
  const completed = useBoolean();
  const popover = usePopover();


  const openDialog = () => {
    popover.onClose();
    completed.onTrue()
  }


  return (
    <>
      <Button
        onClick={() => {
          completed.onTrue();
          popover.onClose();
        }}
        sx={{ height: "30px" }}
        variant="soft"
        // label={date} 
        color={"warning"}
        endIcon={<Iconify icon="lets-icons:view-alt-duotone" width={28} />}

      >
        {t("view")}
      </Button>
      {/* <IconButton color={"warning"} onClick={openDialog}>
        <Iconify icon="mynaui:edit-solid" />
      </IconButton> */}
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("invoices")}
        content={
          <div>
            {/* // <MarkAsCompletedForm maintenanceId={row?.id} close={() => completed?.onFalse()} /> */}
            {/* <EditExitDate setCurrentMentainance={setCurrentMentainance} currentMentainance={currentMentainance} close={() => completed?.onFalse()} /> */}
            <MultiFilePreview files={normalizeInvoices(invoices)} onClose={() => {completed.onFalse()}} />
          </div>
        }
      />
    </>

  )


};

export default ShowInvoices;