import React, { useContext, useEffect } from 'react'
import ProductContext from '../productcontext';
import { Card, Typography, Box } from "@mui/material";
import TransactionChart from './TransactionChart';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

export default function Dashboard(props) {
  
  const { progress } = props;
  
  document.title = "Dashboard - Inventory"
  
  // Access the product context
  const context = useContext(ProductContext);
  const { transactions , fetchTransactions } = context;

  // Calculate total sales and purchases
  const totalSales = transactions.reduce((acc, curr) => acc + (curr.type === "out" ? curr.quantity : 0), 0);
  const totalPurchases = transactions.reduce((acc, curr) => acc + (curr.type === "in" ? curr.quantity : 0), 0);
  
  // Function to format numbers
  const formatSmartNumber = (num) => {
  if (num <= 999999) {
    return num.toLocaleString(); // full number with commas
  }
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };
  
  useEffect(() => {
    fetchTransactions(progress);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* Dashboard Title */}
      <Box variant="h4" component="h1" sx={{ m: 5,textAlign: 'center', fontWeight: 'bold' }} color={"primary.dark"}>
        Dashboard
      </Box>


      <Box sx={{ display:{md:'flex', sm:"block"},justifyContent:"center", alignItems: 'center',  flexWrap: 'wrap', gap: 2 }}>
        
        <Box sx={{width:{md:"50%", sm:"90%", xs:"90%"}, m:{sm:"auto", xs:"auto"}}}>
          <TransactionChart transactions={transactions} />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: {xs:"column", sm: 'row', md: 'column' }, justifyContent: 'center', alignItems: 'center', gap: 8, width:{md:"30%"}, m:{sm:4, xs:4} }}>
          <Card sx={{ m:{sm:"2",xs:"auto"}, width: 300, display:"flex", alignItems: "center", justifyContent: "space-between", p: 2, boxShadow: 3, borderRadius: 3, bgcolor: "primary.main", color: "white",}}>
            {/* Left side text */}
            <Box>
              <Typography variant="h6" gutterBottom>Total Stock-Out</Typography>
              <Typography variant="h4" fontWeight="bold"><Tooltip title={totalSales} slots={{transition: Fade,}} slotProps={{transition: { timeout: 600 },}} arrow placement="bottom-end">{formatSmartNumber(totalSales)}</Tooltip></Typography>
            </Box>
            {/* Right side icon */}
            <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", borderRadius: "50%", p: 1.5, display: "flex", alignItems: "center", justifyContent: "center",}}>
              <ShoppingCartIcon fontSize="large" />
            </Box>
          </Card>

          <Card sx={{ m:{sm:"2",xs:"auto"}, width: 300, minWidth: 250, display:"flex", alignItems: "center", justifyContent: "space-between", p: 2, boxShadow: 3, borderRadius: 3, bgcolor: "success.main", color: "white",}}>
            {/* Left side text */}
            <Box>
              <Typography variant="h6" gutterBottom>Total Stock-In</Typography>
              <Typography variant="h4" fontWeight="bold"><Tooltip title={totalPurchases} slots={{transition: Fade,}} slotProps={{transition: { timeout: 600 },}} arrow placement="bottom-end">{formatSmartNumber(totalPurchases)}</Tooltip></Typography>
            </Box>
            {/* Right side icon */}
            <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", borderRadius: "50%", p: 1.5, display: "flex", alignItems: "center", justifyContent: "center",}}>
              <MoveToInboxIcon  fontSize="large" />
            </Box>
          </Card>
        </Box>  
      </Box>
    </>
  )
}
        
      