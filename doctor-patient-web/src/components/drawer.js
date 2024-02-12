import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const TemporaryDrawer = ({ anchor, isOpen, onClose, children }) => {
  const toggleDrawer = (open) => () => {
    if (onClose && typeof onClose === 'function') {
      onClose(open);
    }
  };

  return (
    <Drawer anchor={anchor} open={isOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {children}
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;
