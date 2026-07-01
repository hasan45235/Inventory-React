import React, { useContext, useEffect, useRef, useState } from 'react'
import ProductContext from '../productcontext.js';
import AddProduct from './AddProduct';

// SweetAlert
import Swal from 'sweetalert2';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Container from "@mui/material/Container";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';



export default function Products(props) {
  
  document.title = "Products - Inventory"

  // Edit Modal 
  const editStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  borderRadius: '8px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  };
  
  const editRef = useRef();
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Transaction Modal 
  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  borderRadius: '8px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  };

  const tranRef = useRef();

// Add Modal 
  const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  borderRadius: '8px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  border: 'none',
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
  const { fetchnotes, products, updateProduct , delProduct , addTransaction} = context;
  
  const [data, setData] = useState({ name: '', price: '', quantity: ''});
  const [transData, setTransData] = useState({product:"", productName: "", quantity: 0, note: '', type: '' });
  const [id, setId] = useState(null);

  const handleEdit = (product) => {
    setData({ name: product.name, price: product.unitPrice, quantity: product.quantity });
    setId(product._id);
    editRef.current.click();
  };

  const handleAdd = () => {
    addRef.current.click();
  };

  const deleteProduct = (id , progress) => {
    // Call the delete API or context function here
    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
      delProduct(id , progress);
    }
    });
  }

  const updateProd = (e) =>{
      updateProduct(id, data, progress);
      handleClose();
  }
  
  const handleAddToCart = (product) => {
    setTransData({product:product._id, productName: product.name, quantity: 0, note: '', type: '' });
    tranRef.current.click();
    
  };

  const arr = products.map((product) => ({
  label: product.name,
  id: product._id,
  quantity: product.quantity,
  }));

  const handleTransaction = (e)=>{
    e.preventDefault();
    
    if(transData.type === "" ){
      setValid({error: true, msg: 'Please select a transaction type!'});
      return;
    }else{
      setValid({error: false, msg: ''});
    }
    
    if(arr.some(item => item.id === transData.product && item.quantity < transData.quantity && transData.type === "out")){
      handleClose3();
      Swal.fire({
        title: 'Error!',
        text: 'Insufficient product quantity!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      
      return;
    }
    addTransaction(transData , progress);
    handleClose3();
  }

  const [valid, setValid] = useState({error: false, msg: ''});
  
  

  const onChange2 = (e) => {
    const { name, value } = e.target;
    setTransData((prevData) => ({ ...prevData, [name]: value }));
  }


  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }
  
  useEffect(() => {
    
    fetchnotes(progress);
    // eslint-disable-next-line
  }, []);
  
  
  
  return (
    <div>
      <Box>
        <Button sx={{ display:"none"}} ref={editRef} onClick={handleOpen}>Open modal</Button>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box component="form" onSubmit={(e)=>{updateProd(e)}} sx={editStyle}>

            <Box>
              <TextField fullWidth label="Name" required id="outlined-start-adornment" name="name" value={data.name} onChange={onChange} slotProps={{input: {startAdornment: <InputAdornment position="start"></InputAdornment>,},}}/>
            </Box><br />
            
            <Box>
              <FormControl fullWidth required>
                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                <OutlinedInput type='number' name='price' value={data.price} onChange={onChange} id="outlined-adornment-amount" startAdornment={<InputAdornment position="start">$</InputAdornment>} label="Amount" />
              </FormControl><br />
            </Box><br />
            <Box>
              <FormControl fullWidth required>
                <InputLabel htmlFor="outlined-adornment-amount">Quantity</InputLabel>
                <OutlinedInput type='number' name='quantity' value={data.quantity} onChange={onChange} id="outlined-adornment-amount" startAdornment={<InputAdornment position="start"><ShoppingCartIcon /></InputAdornment>} label="Amount" />
              </FormControl>
            </Box><br />
            <Box sx={{display:"flex", justifyContent:"space-between", gap:2}}>
              <Button variant="outlined" sx={{width: '100%'}} onClick={handleClose}> Close </Button>
              <Button type='submit' variant="contained" sx={{width: '100%'}} > Update </Button>
            </Box>
          </Box>
        </Modal>
      </Box>

      <Box>
        <Button ref={addRef} sx={{ display:"none"}} onClick={handleOpen2}>Open modal</Button>
        <Modal open={open2}  onClose={handleClose2} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style2}>
            <AddProduct progress={progress} close={handleClose2}/>
          </Box>
        </Modal>
      </Box>

      <Box>
        <Button ref={tranRef} sx={{ display:"none"}} onClick={handleOpen3}>Open modal</Button>
        <Modal open={open3}  onClose={handleClose3} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box component="form" onSubmit={(e)=>{handleTransaction(e)}} sx={style}>
          <Autocomplete id="readOnly" readOnly defaultValue={transData.productName} renderInput={(params) => (<TextField {...params} label="Product" variant="outlined" />)}/>
          <br />
          <FormControl fullWidth required>
            <InputLabel htmlFor="outlined-adornment-amount">Quantity</InputLabel>
            <OutlinedInput type='number' name='quantity' onChange={onChange2} id="outlined-adornment-amount" startAdornment={<InputAdornment position="start"><ShoppingCartIcon /></InputAdornment>} label="Amount" />
          </FormControl><br /><br />
          <Box>
              <TextField fullWidth required label="Note" id="outlined-start-adornment" name="note"  onChange={onChange2} slotProps={{input: {startAdornment: <InputAdornment position="start"></InputAdornment>,},}}/>
          </Box><br />
          <FormControl sx={{ minWidth: 120 }} error={valid.error} size="small">
            <InputLabel id="demo-select-small-label">Select</InputLabel>
            <Select labelId="demo-select-small-label"  id="demo-select-small" name='type'  value={transData.type} label="transaction" onChange={onChange2}>
              <MenuItem value=""></MenuItem>
              <MenuItem value={"in"}>In</MenuItem>
              <MenuItem value={"out"}>Out</MenuItem>
            </Select>
            {valid.error && <FormHelperText>{valid.msg}</FormHelperText>}
          </FormControl><br /><br />
          <Button type='submit' variant="contained" sx={{width: '100%', p: 1}} >Add Transaction</Button>
          </Box>
        </Modal>
      </Box>

      <Container sx={{ mb: 3 , mt: 15 }}>  
        <Box sx={{display:{xs:"block", sm:"flex"}, justifyContent:"space-between"}}>  
          <Typography variant="h4" sx={{width:{xs:"100%", sm:"max-content"},m:{xs:"auto", sm:"none", md:"5"}, p:{xs:2} , fontWeight: 'bold' }} color={"primary.dark"}>Your Products</Typography>
          <Button variant="contained" sx={{width:{xs:"100%", sm:"max-content"},m:{xs:"auto"}, p:1 }} onClick={()=>{handleAdd()}}>Add Product</Button>
        </Box>
      </Container>
      
      <Container>
      <Box sx={{ mb: 3 , mt: 1, width: '100%' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="styled table">
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} >No.</TableCell>
                  <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} >Product</TableCell>
                  <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">SKU</TableCell>
                  <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">Quantity</TableCell>
                  <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">Price</TableCell>
                  <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index)=>(
                <TableRow key={product._id} sx={{"&:nth-of-type(odd)": { backgroundColor: "#fafafa" },"&:hover": { backgroundColor: "#f0f0f0" }}}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.sku}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">${product.unitPrice}</TableCell>
                  <TableCell align="right">
                  <IconButton color='warning'><PostAddIcon onClick={() => handleAddToCart(product)} /></IconButton>
                  <IconButton color="primary"><EditIcon onClick={() => handleEdit(product)} /></IconButton>
                  <IconButton color="error"><DeleteIcon onClick={() => deleteProduct(product._id , progress)} /></IconButton>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </div>
  )
}

