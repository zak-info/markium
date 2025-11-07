import React from "react";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import Label from "src/components/label";

const StatusLabel = ({ currentMentainance,msg }) => {
  const targetDate = new Date(currentMentainance?.exit_date);
  const today = new Date();
  const daysDifference = differenceInDays(targetDate, today);

  let label = "";
  let color = "default";

  if(currentMentainance?.status?.key == "completed"){
    label = t("completed");
    color = "success"; // use theme color instead of hex
  }else if (daysDifference > 3) {
    label = t("in_processing");
    color = "primary"; // use theme color instead of hex
  } else if (daysDifference >= 0 && daysDifference <= 3) {
    label = t("is_soon");
    color = "warning";
  } else {
    label = t("too_late");
    color = "error";
  }

  return (
    <Label variant="soft" sx={{ m: 0 }} color={color}>
      {label} { !["primary","success"]?.includes(color)  ? msg:null}
    </Label>
  );
};

export default StatusLabel;
