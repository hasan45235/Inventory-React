import React, { useContext, useState } from 'react'
import ProductContext from '../productcontext';

// MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from '@mui/material/Button';
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";





const AddProduct = (props) => {

  // Props and Context
  const { progress , close } = props;
  const context = useContext(ProductContext);
  const { addProduct , products} = context;

  // Add Product 
  const [sku, setSku] = useState({error: false, msg: ''});
  const [data, setData] = useState({ name: '', sku: '', price: '', quantity: ''});

  const addItem = (e , progress) => {
    e.preventDefault();  

    // Validate SKU uniqueness
    if(products.some(product => product.sku === data.sku)){
      setSku({error: true, msg: 'SKU already exists!'});
      return;
    }else{
      setSku({error: false, msg: ''});
    } 
    
    addProduct(data, progress);
    close()
  }
  
  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <Container sx={{ p: 0 }}>
        <Typography variant="h4" component="h1" sx={{ m: 1 }} gutterBottom>
          Add Product
        </Typography>
        <Box component="form" sx={{ '& > :not(style)': { m: 5 } , height:"auto" , width: "100%" }} onSubmit={(event)=>{addItem(event , progress);}}  autoComplete="off" >
          <Box>
            <TextField fullWidth label="Name" id="outlined-start-adornment" name="name" onChange={onChange} required slotProps={{input: {startAdornment: <InputAdornment position="start"></InputAdornment>,},}}/>
          </Box>
          <Box>
            <TextField fullWidth error={sku.error} label="SKU" helperText={sku.error ? sku.msg : ''} id={sku.error === true ? "outlined-error-helper-text" : "outlined-start-adornment"} onChange={onChange} name='sku' required slotProps={{input: {startAdornment: <InputAdornment position="start"></InputAdornment>,},}}/>
          </Box>
          <Box sx={{ display: {sm:'flex', xs:'block'}, justifyContent: 'space-between', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput type='number' name='price'  onChange={onChange} id="outlined-adornment-amount" startAdornment={<InputAdornment position="start">$</InputAdornment>} label="Amount" />
            </FormControl><br /><br />
            <FormControl fullWidth required>
              <InputLabel htmlFor="outlined-adornment-amount">Quantity</InputLabel>
              <OutlinedInput type='number' name='quantity'  onChange={onChange} id="outlined-adornment-amount" startAdornment={<InputAdornment position="start"><ShoppingCartIcon /></InputAdornment>} label="Amount" />
            </FormControl>
          </Box>

          <Button type='submit' variant="contained" sx={{ m:{ xs: 0, sm:"auto" } }}   startIcon={<AddIcon />}> Add Item</Button>

        </Box>
      </Container>
    </>
  )
}

export default AddProduct


