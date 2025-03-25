import { useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { t } from "i18next";

const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (event) => {
    event.stopPropagation(); // Prevents click from affecting parent elements
    setExpanded(!expanded);
  };

  // Function to limit the text to 8 words
  const getShortText = (text) => {
    const words = text?.split(" ");
    if (words?.length > 8) {
      return words.slice(0, 8).join(" ") + " ...";
    }
    return text;
  };

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          display: "inline",
          fontSize: 14,
        }}
      >
        {expanded ? text : getShortText(text)}
      </Typography>
      {text?.split(" ").length > 8 && (
        // <Button>
        <Box
          onClick={handleToggle}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {/* onClick={handleToggle}
    size="small"
    sx={{
      textTransform: "none",
      fontSize: 12,
      ml: 1, // Adds some spacing between text and button
      display: "inline",
      minWidth: "unset", // Ensures button is inline
      padding: 0, // Removes padding to keep it inline
    }}
    > */}
          {expanded ? t("show_less") : t("show_more")}
          {/* </Button> */}
        </Box>
      )}
    </Box >
  );
};

export default ExpandableText;
