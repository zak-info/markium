import React from "react";
import { Chip, Typography } from "@mui/material";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import Label from "src/components/label";
import { margin } from "@mui/system";

const StatusLabel = ({ date }) => {
  const targetDate = new Date(date);
  const today = new Date();
  const daysDifference = differenceInDays(targetDate, today);

  let label = "";
  let color = "default";

  if (daysDifference > 3) {
    label = t("in_processing");
    color = "#0000FF";
  } else if (daysDifference >= 0 && daysDifference <= 3) {
    label = t("is_soon");
    color = "warning";
  } else {
    label = t("too_late");
    color = "error";
  }

  return <Label variant="soft" sx={{margin:0}}   label={label} color={color} >{label}</Label>;
};

export default StatusLabel;
