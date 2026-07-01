import React, { useContext, useEffect } from "react";
import ProductContext from "../productcontext";
import { Card, Typography, Box, Chip } from "@mui/material";
import TransactionChart from "./TransactionChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
`;

export default function Dashboard(props) {
  const { progress } = props;

  document.title = "Dashboard — InventX";

  const context = useContext(ProductContext);
  const { transactions, fetchTransactions } = context;

  const totalSales = transactions.reduce(
    (acc, curr) => acc + (curr.type === "out" ? curr.quantity : 0),
    0
  );
  const totalPurchases = transactions.reduce(
    (acc, curr) => acc + (curr.type === "in" ? curr.quantity : 0),
    0
  );

  const formatSmartNumber = (num) => {
    if (num <= 999999) return num.toLocaleString();
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };

  // Net flow — positive means more in than out (stock growing)
  const netFlow = totalPurchases - totalSales;
  const flowTrend = netFlow >= 0 ? "positive" : "negative";

  useEffect(() => {
    fetchTransactions(progress);
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        pt: 4,
        pb: 8,
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="overline"
          sx={{
            color: "#f59e0b",
            letterSpacing: 3,
            fontWeight: 700,
            fontSize: "0.8rem",
          }}
        >
          Overview
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#f1f5f9",
            mt: 0.5,
            letterSpacing: "-1px",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.45)", mt: 1 }}
        >
          Real-time inventory insights at a glance
        </Typography>
      </Box>

      {/* KPI Quick Stats Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Chip
          icon={
            flowTrend === "positive" ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )
          }
          label={`Net Flow: ${flowTrend === "positive" ? "+" : ""}${formatSmartNumber(Math.abs(netFlow))}`}
          sx={{
            bgcolor:
              flowTrend === "positive"
                ? "rgba(20, 184, 166, 0.15)"
                : "rgba(239, 68, 68, 0.15)",
            color:
              flowTrend === "positive" ? "#14b8a6" : "#ef4444",
            fontWeight: 700,
            fontSize: "0.85rem",
            px: 1,
            border: "1px solid",
            borderColor:
              flowTrend === "positive"
                ? "rgba(20, 184, 166, 0.3)"
                : "rgba(239, 68, 68, 0.3)",
          }}
        />
        <Chip
          label={`${transactions.length} Transactions`}
          sx={{
            bgcolor: "rgba(245, 158, 11, 0.1)",
            color: "#fbbf24",
            fontWeight: 700,
            fontSize: "0.85rem",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "center",
          alignItems: { xs: "center", lg: "flex-start" },
          gap: 3,
          maxWidth: 1300,
          mx: "auto",
        }}
      >
        {/* Chart */}
        <Box
          sx={{
            width: { xs: "100%", lg: "60%" },
            maxWidth: 750,
          }}
        >
          <TransactionChart transactions={transactions} />
        </Box>

        {/* Stat Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", lg: "column" },
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            width: { xs: "100%", lg: "35%" },
            maxWidth: 400,
          }}
        >
          {/* Stock-Out Card */}
          <Card
            sx={{
              width: "100%",
              maxWidth: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.1))",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(239,68,68,0.15)",
                borderColor: "rgba(239,68,68,0.4)",
              },
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Stock-Out
              </Typography>
              <Tooltip
                title={totalSales.toLocaleString()}
                slots={{ transition: Fade }}
                slotProps={{ transition: { timeout: 600 } }}
                arrow
                placement="bottom-start"
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#fca5a5",
                    mt: 0.5,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                  }}
                >
                  {formatSmartNumber(totalSales)}
                </Typography>
              </Tooltip>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
                units dispatched
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: "rgba(239,68,68,0.15)",
                borderRadius: 3,
                p: 1.5,
                display: "flex",
                animation: `${pulse} 3s ease-in-out infinite`,
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 32, color: "#fca5a5" }} />
            </Box>
          </Card>

          {/* Stock-In Card */}
          <Card
            sx={{
              width: "100%",
              maxWidth: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 3,
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(16,185,129,0.1))",
              border: "1px solid rgba(20,184,166,0.2)",
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(20,184,166,0.15)",
                borderColor: "rgba(20,184,166,0.4)",
              },
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Stock-In
              </Typography>
              <Tooltip
                title={totalPurchases.toLocaleString()}
                slots={{ transition: Fade }}
                slotProps={{ transition: { timeout: 600 } }}
                arrow
                placement="bottom-start"
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#5eead4",
                    mt: 0.5,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                  }}
                >
                  {formatSmartNumber(totalPurchases)}
                </Typography>
              </Tooltip>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>
                units received
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: "rgba(20,184,166,0.15)",
                borderRadius: 3,
                p: 1.5,
                display: "flex",
                animation: `${pulse} 3s ease-in-out infinite 0.5s`,
              }}
            >
              <MoveToInboxIcon sx={{ fontSize: 32, color: "#5eead4" }} />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
