import React from "react";
import { Chip } from "@mui/material";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import { useBoolean } from "src/hooks/use-boolean";
import { usePopover } from "src/components/custom-popover";
import ContentDialog from "src/components/custom-dialog/content-dialog";
import EditExitDate from "./EditExitDate";

const EditExitDatePopUp = ({ currentMentainance }) => {
  const completed = useBoolean();
  const popover = usePopover();


  return (
    <>
      <Chip
        onClick={() => {
          completed.onTrue();
          popover.onClose();
        }}
        sx={{ marginInlineStart: "10px" }} variant="soft" label={"edit"} color={"warning"} />
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title="Complete"
        content={
          <div>
            {/* // <MarkAsCompletedForm maintenanceId={row?.id} close={() => completed?.onFalse()} /> */}
            <EditExitDate currentMentainance={currentMentainance} close={() => completed?.onFalse()} />
          </div>
        }
      />
    </>

  )


};

export default EditExitDatePopUp;