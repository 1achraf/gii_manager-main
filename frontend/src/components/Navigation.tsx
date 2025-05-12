import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    People as PeopleIcon,
    Assessment as AssessmentIcon,
    Badge as BadgeIcon,
    EventSeat as EventSeatIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';

interface NavigationProps {
    onMenuClick: (menu: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const menuItems = [
        { text: 'Gestion des Étudiants', icon: <PeopleIcon />, value: 'students' },
        { text: 'Jurys de Semestre', icon: <AssessmentIcon />, value: 'jury' },
        { text: 'Anonymats', icon: <BadgeIcon />, value: 'anonymat' },
        { text: 'Plans de Salles', icon: <EventSeatIcon />, value: 'seating' },
        { text: 'Justificatifs', icon: <AssignmentIcon />, value: 'justifications' },
        { text: 'Upload de Données', icon: <AssignmentIcon />, value: 'upload' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    GII Manager
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((item) => (
                    <ListItemButton 
                        key={item.value}
                        onClick={() => {
                            onMenuClick(item.value);
                            if (isMobile) setMobileOpen(false);
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        GII Manager
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: 240,
                            backgroundColor: theme.palette.background.default
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'none' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: 240,
                            backgroundColor: theme.palette.background.default
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
};

export default Navigation; 