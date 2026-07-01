import React, { useContext, useState } from "react";
import ProductContext from "../productcontext";

// MUI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CategoryIcon from "@mui/icons-material/Category";
import QrCodeIcon from "@mui/icons-material/QrCode";

const AddProduct = (props) => {
  const { progress, close, setIsProductAdded } = props;
  const context = useContext(ProductContext);
  const { addProduct, products } = context;

  const [sku, setSku] = useState({ error: false, msg: "" });
  const [data, setData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  const addItem = (e, progress) => {
    e.preventDefault();

    if (products.some((product) => product.sku === data.sku)) {
      setSku({ error: true, msg: "SKU already exists!" });
      return;
    } else {
      setSku({ error: false, msg: "" });
    }

    addProduct(data, progress)
    setIsProductAdded(true)
    
    close();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };


  return (<>
    <Container
      sx={{
        p: 3,
        background:
          "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))",
        borderRadius: 4,
      }}
    >
      {/* Header */}
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
          Add New Product
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
          Fill in the details to add a new inventory item
        </Typography>
      </Box>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        onSubmit={(event) => {
          addItem(event, progress);
        }}
        autoComplete="off"
      >
        {/* Product Name */}
        <TextField
          fullWidth
          label="Product Name"
          name="name"
          onChange={onChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon sx={{ color: "rgba(245,158,11,0.6)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
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
          }}
        />

        {/* SKU */}
        <TextField
          fullWidth
          error={sku.error}
          label="SKU"
          helperText={sku.error ? sku.msg : ""}
          onChange={onChange}
          name="sku"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCodeIcon sx={{ color: "rgba(245,158,11,0.6)" }} />
              </InputAdornment>
            ),
          }}
          sx={{
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
            "& .MuiFormHelperText-root": {
              color: sku.error ? "#fca5a5" : "inherit",
            },
          }}
        />

        {/* Price & Quantity Row */}
        <Box
          sx={{
            display: { sm: "flex", xs: "block" },
            gap: 2,
          }}
        >
          <FormControl
            fullWidth
            required
            sx={{ mb: { xs: 2.5, sm: 0 } }}
          >
            <InputLabel
              htmlFor="price-input"
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
              onChange={onChange}
              id="price-input"
              startAdornment={
                <InputAdornment position="start">
                  <Typography sx={{ color: "rgba(245,158,11,0.7)", fontWeight: 700 }}>
                    $
                  </Typography>
                </InputAdornment>
              }
              label="Price"
              sx={{
                color: "#f1f5f9",
                "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                "&:hover fieldset": { borderColor: "rgba(245,158,11,0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
              }}
            />
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel
              htmlFor="qty-input"
              sx={{
                color: "rgba(255,255,255,0.45)",
                "&.Mui-focused": { color: "#f59e0b" },
              }}
            >
              Quantity
            </InputLabel>
            <OutlinedInput
              type="number"
              name="quantity"
              onChange={onChange}
              id="qty-input"
              startAdornment={
                <InputAdornment position="start">
                  <ShoppingCartIcon sx={{ color: "rgba(20,184,166,0.7)" }} />
                </InputAdornment>
              }
              label="Quantity"
              sx={{
                color: "#f1f5f9",
                "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                "&:hover fieldset": { borderColor: "rgba(20,184,166,0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#14b8a6" },
              }}
            />
          </FormControl>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            mt: 1,
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
          Add Product
        </Button>
      </Box>
      </Container>
      </>
    );
  }
  
  

export default AddProduct;
