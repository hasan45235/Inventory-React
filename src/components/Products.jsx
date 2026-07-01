import React, { useContext, useEffect, useRef, useState } from "react";
import ProductContext from "../productcontext.js";
import AddProduct from "./AddProduct";


// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
// Toast Notifications
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

export default function Products(props) {
  document.title = "Products — InventX";

  // ---------- Edit Modal ----------
  const editStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "50%", md: "40%" },
    borderRadius: "16px",
    bgcolor: "#1e293b",
    border: "1px solid rgba(245,158,11,0.15)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    p: 4,
  };

  const editRef = useRef();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ---------- Transaction Modal ----------
  const tranStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "50%", md: "40%" },
    borderRadius: "16px",
    bgcolor: "#1e293b",
    border: "1px solid rgba(245,158,11,0.15)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    p: 4,
  };

  const tranRef = useRef();

  // ---------- Add Modal ----------
  const addStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "70%", md: "50%" },
    borderRadius: "16px",
    bgcolor: "#1e293b",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    border: "none",
    p: 0,
  };

  const addRef = useRef();
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const [open3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);

  const { progress } = props;
  
  const context = useContext(ProductContext);
  const { fetchnotes, products, updateProduct, delProduct, addTransaction } = context;
  
  const [data, setData] = useState({ name: "", price: "", quantity: "" });
  const [transData, setTransData] = useState({
    product: "",
    productName: "",
    quantity: 0,
    note: "",
    type: "",
  });
  const [id, setId] = useState(null);

  const handleEdit = (product) => {
    setData({
      name: product.name,
      price: product.unitPrice,
      quantity: product.quantity,
    });
    setId(product._id);
    editRef.current.click();
  };
  
  const handleAdd = () => {
    addRef.current.click();
  };

  const deleteProduct = (id, progress) => {
    delProduct(id, progress);
    showToast("Product deleted successfully!", "success");
  };


  const updateProd = (e) => {
    e.preventDefault();
    updateProduct(id, data, progress);
    showToast("Product updated successfully!", "success");
    handleClose();
  };

  const handleAddToCart = (product) => {
    setTransData({
      product: product._id,
      productName: product.name,
      quantity: 0,
      note: "",
      type: "",
    });
    tranRef.current.click();
  };

  const arr = products.map((product) => ({
    label: product.name,
    id: product._id,
    quantity: product.quantity,
  }));

  const handleTransaction = (e) => {
    e.preventDefault();

    if (transData.type === "") {
      setValid({ error: true, msg: "Please select a transaction type!" });
      return;
    } else {
      setValid({ error: false, msg: "" });
    }
    
    if (
      arr.some(
        (item) =>
          item.id === transData.product &&
          item.quantity < transData.quantity &&
          transData.type === "out"
      )
    ) {
      handleClose3();
      showToast("Insufficient product quantity!", "error");
      
      return;
    }
    addTransaction(transData, progress);
    showToast("transaction added successfully!", "success");
    handleClose3();
  };
  
  const [isProductAdded, setIsProductAdded] = useState(false)
  const [valid, setValid] = useState({ error: false, msg: "" });
  // Toast state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };
  const hideToast = () => setToast((prev) => ({ ...prev, open: false }));

  useEffect(()=>{
    if(isProductAdded === true){
      showToast("Product added successfully!", "success")
    }
  },[isProductAdded])

  const onChange2 = (e) => {
    const { name, value } = e.target;
    setTransData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    fetchnotes(progress);
    

    // eslint-disable-next-line
  }, []);

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        pt: 4,
        pb: 8,
      }}
    >
      {/* ========== EDIT MODAL ========== */}
      <Box>
        <Button sx={{ display: "none" }} ref={editRef} onClick={handleOpen}>
          Open modal
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="edit-modal-title"
        >
          <Box
            component="form"
            onSubmit={(e) => {
              updateProd(e);
            }}
            sx={editStyle}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#f1f5f9",
                mb: 3,
                textAlign: "center",
              }}
            >
              Edit Product
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                fullWidth
                label="Name"
                required
                name="name"
                value={data.name}
                onChange={onChange}
                sx={darkInputSx}
              />
              <FormControl fullWidth required>
                <InputLabel
                  sx={{
                    color: "rgba(255,255,255,0.45)",
                    "&.Mui-focused": { color: "#f59e0b" },
                  }}
                >
                  Price
                </InputLabel>
                <OutlinedInput
                  type="number"
                  name="price"
                  value={data.price}
                  onChange={onChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Typography
                        sx={{ color: "rgba(245,158,11,0.7)", fontWeight: 700 }}
                      >
                        $
                      </Typography>
                    </InputAdornment>
                  }
                  label="Price"
                  sx={{
                    color: "#f1f5f9",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(245,158,11,0.4)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
                  }}
                />
              </FormControl>
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
                  value={data.quantity}
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

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleClose}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    borderColor: "rgba(255,255,255,0.15)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.3)",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>

      {/* ========== ADD PRODUCT MODAL ========== */}
      <Box>
        <Button sx={{ display: "none" }} ref={addRef} onClick={handleOpen2}>
          Open modal
        </Button>
        <Modal open={open2} onClose={handleClose2}>
          <Box sx={addStyle}>
            <AddProduct progress={progress} close={handleClose2} setIsProductAdded={()=>setIsProductAdded()}/>
          </Box>
        </Modal>
      </Box>

      {/* ========== TRANSACTION MODAL ========== */}
      <Box>
        <Button sx={{ display: "none" }} ref={tranRef} onClick={handleOpen3}>
          Open modal
        </Button>
        <Modal open={open3} onClose={handleClose3}>
          <Box
            component="form"
            onSubmit={(e) => {
              handleTransaction(e);
            }}
            sx={tranStyle}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#f1f5f9",
                mb: 3,
                textAlign: "center",
              }}
            >
              New Transaction
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Autocomplete
                id="readOnly"
                readOnly
                defaultValue={transData.productName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    variant="outlined"
                    sx={darkInputSx}
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
                  onChange={onChange2}
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
                onChange={onChange2}
                sx={darkInputSx}
              />
              <FormControl
                sx={{ minWidth: 120 }}
                error={valid.error}
                size="small"
              >
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
                  value={transData.type}
                  label="Type"
                  onChange={onChange2}
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
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="in">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                {valid.error && (
                  <FormHelperText>{valid.msg}</FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.4,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  },
                }}
              >
                Add Transaction
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>

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
            <InventoryIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Products
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
              {products.length}
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={handleAdd}
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
            Add Product
          </Button>
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
                  "Quantity",
                  "Price",
                  "Actions",
                ].map((head) => (
                  <TableCell
                    key={head}
                    align={head === "#" || head === "Product" ? "left" : "right"}
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
              {products.length === 0 ? (
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
                    <InventoryIcon
                      sx={{ fontSize: 48, mb: 1, opacity: 0.3 }}
                    />
                    <Typography variant="body1">
                      No products yet. Add your first product!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow
                    key={product._id}
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
                      {product.name}
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
                      {product.sku}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "#5eead4",
                        fontWeight: 700,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {product.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: "#fbbf24",
                        fontWeight: 600,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      ${product.unitPrice}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}
                      >
                        <Tooltip title="Add Transaction" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleAddToCart(product)}
                            sx={{
                              color: "#14b8a6",
                              "&:hover": {
                                bgcolor: "rgba(20,184,166,0.12)",
                              },
                            }}
                          >
                            <PostAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(product)}
                            sx={{
                              color: "#f59e0b",
                              "&:hover": {
                                bgcolor: "rgba(245,158,11,0.12)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            size="small"
                            onClick={() =>
                              deleteProduct(product._id, progress)
                            }
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                bgcolor: "rgba(239,68,68,0.12)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
            ...(toast.severity === "warning" && {
              bgcolor: "rgba(245,158,11,0.95)",
              color: "#0f172a",
            }),
            ...(toast.severity === "info" && {
              bgcolor: "rgba(59,130,246,0.95)",
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

