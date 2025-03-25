import React from "react";
import { Chip } from "@mui/material";
import { differenceInDays } from "date-fns";
import { t } from "i18next";

const StatusLabel = ({ date }) => {
  const targetDate = new Date(date);
  const today = new Date();
  const daysDifference = differenceInDays(targetDate, today);

  let label = "";
  let color = "default";

  if (daysDifference > 3) {
    label = t("in_processing");
    color = "success";
  } else if (daysDifference >= 0 && daysDifference <= 3) {
    label = t("is_soon");
    color = "warning";
  } else {
    label = t("too_late");
    color = "error";
  }

  return <Chip variant="soft" label={label} color={color} />;
};

export default StatusLabel;
