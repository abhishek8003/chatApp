import { Box, Popover, Typography } from "@mui/material";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setaccountInfoToggle } from "../../../redux/features/accountInfoToggle";
import AccountInfoNav from "./AccountInfoNav";
import Overview from "./accountDetail/Overview";
import Settings from "./accountDetail/Settings";

function AccountInfo({ targetElement }) {
  let accountInfoToggle = useSelector((store) => {
    return store.accountInfoToggle;
  });
  let dispatch = useDispatch();
  let selectedUser = useSelector((store) => {
    return store.selectedUser;
  });
  let accountDetailView = useSelector((store) => {
    return store.accountDetailView;
  });
  return (
    <Popover
      open={accountInfoToggle}
      onClose={() => {
        dispatch(setaccountInfoToggle());
      }}
      anchorEl={targetElement.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {console.log("in pop:", selectedUser)}
      <Typography sx={{ p: 2, display:"flex", minHeight:"300px", width:"350px"}}>

        <AccountInfoNav></AccountInfoNav>
        <Box sx={{
          border:"2px solid grey",
          flexGrow:"1",
           height:"100%"
        }}>
          {accountDetailView == "overview" ? <Overview></Overview> : ""}
          {/* {accountDetailView == "settings" ? <Settings></Settings>: ""} */}
        </Box>
      </Typography>
    </Popover>
  );
}

export default AccountInfo;
