import  React , {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MenuIcon from "@mui/icons-material/Menu";
import InventoryIcon from '@mui/icons-material/Inventory';


export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const pages = [
    { label: "Dashboard", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Transaction", path: "/transaction" },
  ];

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo / Brand */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}><InventoryIcon /> Inventory </Typography>

        {/* Desktop Tabs */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Tabs value={location.pathname} textColor="inherit">
            {pages.map((page) => (
              <Tab key={page.path} label={page.label} value={page.path} component={Link} to={page.path} />
            ))}
          </Tabs>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton size="large" aria-label="menu" color="inherit" onClick={handleOpenMenu} >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} >
            {pages.map((page) => (
              <MenuItem key={page.path} component={Link} to={page.path} onClick={handleCloseMenu} >
                {page.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
