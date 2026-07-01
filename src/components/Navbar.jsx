import React, { useState, useEffect } from "react";
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
import InventoryIcon from "@mui/icons-material/Inventory";
import { keyframes } from "@emotion/react";

const glow = keyframes`
    0% { text-shadow: 0 0 4px rgba(245,158,11,0.3); }
    50% { text-shadow: 0 0 12px rgba(245,158,11,0.6); }
    100% { text-shadow: 0 0 4px rgba(245,158,11,0.3); }
`;

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const pages = [
    { label: "Dashboard", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Transaction", path: "/transaction" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // eslint-disable-next-line
  const handleOpenMenu = (event) => {setAnchorEl(event.currentTarget)};
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        background: scrolled
          ? "rgba(15, 23, 42, 0.85)"
          : "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid",
        borderColor: scrolled
          ? "rgba(245, 158, 11, 0.15)"
          : "rgba(255, 255, 255, 0.05)",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs:2, md: 4 } }}>
        {/* Logo / Brand */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              "& .MuiSvgIcon-root": {
                animation: `${glow} 2s ease-in-out infinite`,
          }}}}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderRadius: 2,
              p: 0.8,
              display: "flex",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
            }}
          >
            <InventoryIcon sx={{ fontSize: 22, color: "#0f172a" }} />
          </Box>
          <Typography 
            variant="body1" 
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.1rem", md: "1.4rem" },
            }}
          >
            InventX
          </Typography>
        </Box>

        {/* Desktop Tabs */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Tabs
            value={location.pathname}
            textColor="inherit"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#f59e0b",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            {pages.map((page) => (
              <Tab
                key={page.path}
                label={page.label}
                value={page.path}
                component={Link}
                to={page.path}
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  px: 3,
                  transition: "all 0.2s",
                  "&.Mui-selected": {
                    color: "#fbbf24",
                    fontWeight: 700,
                  },
                  "&:hover": {
                    color: "#f59e0b",
                    backgroundColor: "rgba(245.06)",
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="menu={handleOpenMenu}"
            sx={{
              color: "#f59e0b",
              "&:hover": { backgroundColor: "rgba(245,158,11,0.1)" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: "rgba(30, 41, 59, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(245,158,11,0.15)",
                borderRadius: 2,
                minWidth: 180,
              },
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.path}
                component={Link}
                to={page.path}
                onClick={handleCloseMenu}
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(245,158,11,0.1)",
                    color: "#f59e0b",
                  },
                }}
              >
                {page.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
