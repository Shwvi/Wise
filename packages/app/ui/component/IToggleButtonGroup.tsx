import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { dispatchNodeFilterState, useSubScribeNodeFilterState } from "../state";
import { Tooltip } from "@mui/material";

export function IToggleButtonGroup() {
  const { value: nodeFilterState } = useSubScribeNodeFilterState();
  return (
    <ToggleButtonGroup
      color="primary"
      className="w-full flex"
      value={nodeFilterState}
      onChange={(_, newValue) => {
        dispatchNodeFilterState(newValue);
      }}
    >
      <ToggleButton value="completed" className="flex-1">
        <Tooltip title="Completed">
          <BookmarkAddedIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="uncompleted" className="flex-1">
        <Tooltip title="Un Completed">
          <BookmarkRemoveIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="deleted" className="flex-1" color="error">
        <Tooltip title="Deleted">
          <DeleteIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
