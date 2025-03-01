import { Box, Popover, Typography } from "@mui/material";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupInfoToggle } from "../../../redux/features/groupInfoToggle";
import GroupInfoNav from "./GroupInfoNav";
import Overview from "./groupDetail/Overview";
import Settings from "./groupDetail/Settings";
import Members from "./groupDetail/Members";

function GroupInfo({ targetElement }) {
  let groupInfoToggle = useSelector((store) => {
    return store.groupInfoToggle;
  });
  let dispatch = useDispatch();
  let selectedGroup = useSelector((store) => {
    return store.selectedGroup;
  });
  let groupDetailView = useSelector((store) => {
    return store.groupDetailView;
  });

  return (
    <Popover
      open={groupInfoToggle}
      onClose={() => {
        dispatch(setGroupInfoToggle());
      }}
      anchorEl={targetElement.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {/* {!targetElement?"Target is not defined":"Target is defined"} */}
      
      <Typography sx={{ p: 2, display:"flex", minHeight:"300px", width:"350px"}}>

        <GroupInfoNav></GroupInfoNav>
        <Box sx={{
          border:"2px solid grey",
          flexGrow:"1",
        }}>
          {groupDetailView == "overview" ? <Overview></Overview> : ""}
          {groupDetailView == "settings" ? <Settings></Settings>: ""}
          {groupDetailView == "members" ? <Members></Members>: ""}
        </Box>
      </Typography>
    </Popover>
  );
}

export default GroupInfo;