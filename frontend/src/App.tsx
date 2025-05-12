import React, { useState } from 'react';
import { Box, Toolbar, AppBar, Typography, Avatar } from '@mui/material';
import Navigation from './components/Navigation';
import ToolManager from './components/ToolManager';
import logo from './logo.png'; // Remplacez par le chemin de votre logo

function App() {
  const [currentTool, setCurrentTool] = useState('');

  const handleMenuClick = (tool: string) => {
    setCurrentTool(tool);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Avatar src={logo} alt="Logo" sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            GII Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Navigation onMenuClick={handleMenuClick} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar /> {/* Spacer for AppBar */}
        <ToolManager currentTool={currentTool} />
      </Box>
    </Box>
  );
}

export default App;
