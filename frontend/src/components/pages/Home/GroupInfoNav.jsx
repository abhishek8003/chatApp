import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { setgroupDetailView } from '../../../redux/features/groupDetailView';
import PersonIcon from '@mui/icons-material/Person';
function GroupInfoNav() {
    let groupDetailView=useSelector((store)=>{
        return store.groupDetailView;
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
        borderRight: '2px solid #ddd',
      }}
    >
      <Tooltip title="Overview" onClick={()=>{
        dispatch(setgroupDetailView("overview"))
      }}>
        <IconButton >
          <InfoIcon sx={{ color: '#555', fontSize: 28 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Members" onClick={()=>{
        dispatch(setgroupDetailView("members"))
      }}>
        <IconButton >
          <PersonIcon sx={{ color: '#555', fontSize: 28 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Settings" onClick={()=>{
        dispatch(setgroupDetailView("settings"))
      }}>
        <IconButton>
          <SettingsIcon sx={{ color: '#555', fontSize: 28 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
export default GroupInfoNav;
