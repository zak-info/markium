import React from "react";
import { Button, Chip, IconButton } from "@mui/material";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import { useBoolean } from "src/hooks/use-boolean";
import { usePopover } from "src/components/custom-popover";
import ContentDialog from "src/components/custom-dialog/content-dialog";
import EditExitDate from "./EditExitDate";
import Iconify from "src/components/iconify";

const EditExitDatePopUp = ({ currentMentainance, date, setCurrentMentainance }) => {
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
        sx={{mb:0}}
        // sx={{ marginInlineStart: "18px" }}
        variant="soft"
        // label={date} 
        color={"warning"}
        endIcon={<Iconify icon="mynaui:edit-solid" width={14} />}

      >
        {date}
      </Button>
      {/* <IconButton color={"warning"} onClick={openDialog}>
        <Iconify icon="mynaui:edit-solid" />
      </IconButton> */}
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("exit_date")}
        content={
          <div>
            {/* // <MarkAsCompletedForm maintenanceId={row?.id} close={() => completed?.onFalse()} /> */}
            <EditExitDate setCurrentMentainance={setCurrentMentainance} currentMentainance={currentMentainance} close={() => completed?.onFalse()} />
          </div>
        }
      />
    </>

  )


};

export default EditExitDatePopUp;