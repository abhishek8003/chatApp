import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { setaccountDetailView } from '../../../redux/features/accountDetailView';

function AccountInfoNav() {
    let accountDetailView=useSelector((store)=>{
        return store.accountDetailView;
    });
    let dispatch=useDispatch();
  return (
    <Box
      sx={{
        width: "60px",
        display: 'flex',
        // border:"2px solid red",
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        // borderRight: '2px solid #ddd',
      }}
    >
      <Tooltip title="Overview" onClick={()=>{
        dispatch(setaccountDetailView("overview"))
      }}>
        <IconButton >
          <InfoIcon sx={{ color: '#555', fontSize: 28 }} />
        </IconButton>
      </Tooltip>
      {/* <Tooltip title="Settings" onClick={()=>{
        dispatch(setaccountDetailView("settings"))
      }}>
        <IconButton>
          <SettingsIcon sx={{ color: '#555', fontSize: 28 }} />
        </IconButton>
      </Tooltip> */}
    </Box>
  );
}
export default AccountInfoNav;
