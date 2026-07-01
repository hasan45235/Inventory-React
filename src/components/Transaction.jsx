import React, { useContext, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ProductContext from "../productcontext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// Toast Notifications
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";




export default function Transaction(props) {
  document.title = "Transactions — InventX";

  const { progress } = props;
  const btnRef = useRef();

  const modalOpen = () => {
    btnRef.current.click();
  };

  const [data, setData] = useState({
    product: null,
    quantity: 0,
    note: "",
    type: "",
  });

  const context = useContext(ProductContext);
  const {
    products,
    fetchnotes,
    fetchTransactions,
    transactions,
    addTransaction,
  } = context;

  const arr = products.map((product) => ({
    label: product.name,
    id: product._id,
    quantity: product.quantity,
  }));

  const handleTransaction = (e) => {
    e.preventDefault();

    if (data.product === null) {
      setValid({ error: true, msg: "Select a product!" });
      return;
    }
    if (
      arr.some(
        (item) =>
          item.id === data.product &&
          item.quantity < data.quantity &&
          data.type === "out"
      )
    ) {
      handleClose();
      showToast("Not enough stock!", "error");


      return;
    }

    addTransaction(data, progress);
    showToast("Transaction added successfully!", "success");
    handleClose();
  };

  const [valid, setValid] = useState({ error: false, msg: "" });
  // Toast state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };
  const hideToast = () => setToast((prev) => ({ ...prev, open: false }));


  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "50%", md: "40%" },
    bgcolor: "#1e293b",
    border: "1px solid rgba(245,158,11,0.15)",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const darkInputSx = {
    "& .MuiOutlinedInput-root": {
      color: "#f1f5f9",
      "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
      "&:hover fieldset": { borderColor: "rgba(245,158,11,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.45)",
      "&.Mui-focused": { color: "#f59e0b" },
    },
  };

  // Calculate stats
  const totalIn = transactions
    .filter((t) => t.type === "in")
    .reduce((acc, t) => acc + t.quantity, 0);
  const totalOut = transactions
    .filter((t) => t.type === "out")
    .reduce((acc, t) => acc + t.quantity, 0);

  useEffect(() => {
    fetchnotes(progress);
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
      }}
    >
      {/* ========== ADD TRANSACTION MODAL ========== */}
      <Button ref={btnRef} sx={{ display: "none" }} onClick={handleOpen}>
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="transaction-modal-title"
      >
        <Box
          component="form"
          onSubmit={(e) => {
            handleTransaction(e);
          }}
          sx={style}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                borderRadius: 3,
                p: 1.2,
                mb: 2,
                boxShadow: "0 0 20px rgba(245,158,11,0.25)",
              }}
            >
              <AddIcon sx={{ color: "#0f172a", fontSize: 28 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
              }}
            >
              New Transaction
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}
            >
              Record a stock-in or stock-out movement
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Autocomplete
              disablePortal
              options={arr}
              value={arr.find((opt) => opt.id === data.product) || null}
              onChange={(event, newValue) => {
                setData((prev) => ({
                  ...prev,
                  product: newValue ? newValue.id : "",
                }));
              }}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product"
                  error={valid.error}
                  helperText={valid.error ? valid.msg : ""}
                  sx={{
                    ...darkInputSx,
                    "& .MuiFormHelperText-root": {
                      color: valid.error ? "#fca5a5" : "inherit",
                    },
                  }}
                />
              )}
              PaperComponent={(props) => (
                <Paper
                  {...props}
                  sx={{
                    bgcolor: "#1e293b !important",
                    color: "#f1f5f9",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "& .MuiAutocomplete-option": {
                      "&:hover": {
                        bgcolor: "rgba(245,158,11,0.1) !important",
                      },
                      "&[aria-selected='true']": {
                        bgcolor: "rgba(245,158,11,0.15) !important",
                      },
                    },
                  }}
                />
              )}
            />

            <FormControl fullWidth required>
              <InputLabel
                sx={{
                  color: "rgba(255,255,255,0.45)",
                  "&.Mui-focused": { color: "#14b8a6" },
                }}
              >
                Quantity
              </InputLabel>
              <OutlinedInput
                type="number"
                name="quantity"
                onChange={onChange}
                startAdornment={
                  <InputAdornment position="start">
                    <ShoppingCartIcon
                      sx={{ color: "rgba(20,184,166,0.7)" }}
                    />
                  </InputAdornment>
                }
                label="Quantity"
                sx={{
                  color: "#f1f5f9",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(20,184,166,0.4)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
                }}
              />
            </FormControl>

            <TextField
              fullWidth
              required
              label="Note"
              name="note"
              onChange={onChange}
              sx={darkInputSx}
            />

            <FormControl sx={{ minWidth: 120 }} required size="small">
              <InputLabel
                sx={{
                  color: "rgba(255,255,255,0.45)",
                  "&.Mui-focused": { color: "#f59e0b" },
                }}
              >
                Type
              </InputLabel>
              <Select
                name="type"
                value={data.type}
                label="Type"
                onChange={onChange}
                sx={{
                  color: "#f1f5f9",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(245,158,11,0.4)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#f59e0b",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.5)" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#1e293b",
                      color: "#f1f5f9",
                      border: "1px solid rgba(255,255,255,0.1)",
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select type</em>
                </MenuItem>
                <MenuItem value="in">
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#14b8a6",
                      }}
                    />
                    Stock In
                  </Box>
                </MenuItem>
                <MenuItem value="out">
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#ef4444",
                      }}
                    />
                    Stock Out
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                borderRadius: 2,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  boxShadow: "0 6px 30px rgba(245,158,11,0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Add Transaction
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ========== PAGE CONTENT ========== */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ReceiptLongIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Transactions
            </Typography>
            <Box
              sx={{
                bgcolor: "rgba(245,158,11,0.12)",
                color: "#fbbf24",
                px: 1.5,
                py: 0.3,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              {transactions.length}
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={modalOpen}
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              py: 1.2,
              px: 3,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 4px 20px rgba(245,158,11,0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                boxShadow: "0 6px 25px rgba(245,158,11,0.35)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Add Transaction
          </Button>
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(20,184,166,0.1)",
              border: "1px solid rgba(20,184,166,0.2)",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <TrendingUpIcon sx={{ color: "#14b8a6", fontSize: 20 }} />
            <Typography
              sx={{
                color: "#5eead4",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Stock In: <strong>{totalIn}</strong>
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <TrendingDownIcon sx={{ color: "#ef4444", fontSize: 20 }} />
            <Typography
              sx={{
                color: "#fca5a5",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Stock Out: <strong>{totalOut}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            background:
              "linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                }}
              >
                {[
                  "#",
                  "Product",
                  "SKU",
                  "Note",
                  "Quantity",
                  "Type",
                ].map((head) => (
                  <TableCell
                    key={head}
                    align={["#", "Product"].includes(head) ? "left" : "right"}
                    sx={{
                      color: "#f59e0b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(245,158,11,0.15)",
                      py: 2,
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      color: "rgba(255,255,255,0.3)",
                      py: 8,
                      borderBottom: "none",
                    }}
                  >
                    <ReceiptLongIcon
                      sx={{ fontSize: 48, mb: 1, opacity: 0.3 }}
                    />
                    <Typography variant="body1">
                      No transactions yet. Add your first transaction!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction._id}
                    sx={{
                      transition: "all 0.2s",
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(255,255,255,0.02)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(245,158,11,0.05)",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 600,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f1f5f9",
                        fontWeight: 600,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {transaction.productId?.name}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "monospace",
                        fontWeight: 500,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {transaction.productId?.sku}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "rgba(255,255,255,0.6)",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {transaction.note}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        color:
                          transaction.type === "in" ? "#5eead4" : "#fca5a5",
                      }}
                    >
                      {transaction.type === "in" ? "+" : "-"}
                      {transaction.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.8,
                          px: 1.5,
                          py: 0.4,
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          bgcolor:
                            transaction.type === "in"
                              ? "rgba(20,184,166,0.15)"
                              : "rgba(239,68,68,0.15)",
                          color:
                            transaction.type === "in"
                              ? "#5eead4"
                              : "#fca5a5",
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor:
                              transaction.type === "in"
                                ? "#14b8a6"
                                : "#ef4444",
                          }}
                        />
                        {transaction.type}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
          {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
        sx={{ mb: 2 }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            fontSize: "0.9rem",
            minWidth: 300,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            ...(toast.severity === "success" && {
              bgcolor: "rgba(20,184,166,0.95)",
              color: "#fff",
            }),
            ...(toast.severity === "error" && {
              bgcolor: "rgba(239,68,68,0.95)",
              color: "#fff",
            }),
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
