import React, { useContext, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ProductContext from '../productcontext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from "@mui/material/Container";
import Swal from 'sweetalert2';


export default function Transaction(props) {
  
  document.title = "Transaction - Inventory"

  const {progress} = props
  const btnRef = useRef();

  const modalOpen =()=>{
    btnRef.current.click();
  }
  
  const [data, setData] = useState({ product: null, quantity: 0, note: '', type: '' });


  const context = useContext(ProductContext);
  const { products , fetchnotes , fetchTransactions, transactions, addTransaction } = context;

  const arr = products.map((product) => ({
  label: product.name,
  id: product._id,
  quantity: product.quantity,
  }));
  
  const handleTransaction = (e)=>{
    e.preventDefault();

    if(data.product === null ){
      setValid({error: true, msg: 'Select a product!'});
      return;
    }
    if(arr.some(item => item.id === data.product && item.quantity < data.quantity && data.type === "out")){
      handleClose();
      Swal.fire({
        title: 'Error!',
        text: 'Not enough stock!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
     
    addTransaction(data, progress);

    handleClose();
  }
  
  const [valid, setValid] = useState({error: false, msg: ''});

  const onChange = (e)=>{
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {sm:"50%", xs:"80%"},
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  };


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  
  
  useEffect(() => {
    fetchnotes(progress);
    fetchTransactions(progress);
    // eslint-disable-next-line
  },[]);

  return (
    <div>
      <Button ref={btnRef} sx={{ display: 'none' }} onClick={handleOpen}>Open modal</Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box component="form" onSubmit={(e)=>{handleTransaction(e)}} sx={style}>
          <Autocomplete disablePortal options={arr} name="product" value={arr.find((opt) => opt.id === data.product) || null}  onChange={(event, newValue) => {setData((prev) => ({...prev,product: newValue ? newValue.id : "" }));}}  getOptionLabel={(option) => option.label} renderInput={(params) => <TextField {...params} label="Products" error={valid.error} helperText={valid.error ? valid.msg : ''} />} /><br />
          <FormControl fullWidth required>
            <InputLabel htmlFor="outlined-adornment-amount">Quantity</InputLabel>
            <OutlinedInput type='number' name='quantity' onChange={onChange} id="outlined-adornment-amount" startAdornment={<InputAdornment position="start"><ShoppingCartIcon /></InputAdornment>} label="Amount" />
          </FormControl><br /><br />
          <Box>
              <TextField fullWidth required label="Note" id="outlined-start-adornment" name="note"  onChange={onChange} slotProps={{input: {startAdornment: <InputAdornment position="start"></InputAdornment>,},}}/>
          </Box><br />
          <FormControl sx={{ minWidth: 120 }} required size="small">
            <InputLabel id="demo-select-small-label">Select</InputLabel>
            <Select labelId="demo-select-small-label" id="demo-select-small" name='type' value={data.type} label="transaction" onChange={onChange}>
              <MenuItem value=""></MenuItem>
              <MenuItem value={"in"}>In</MenuItem>
              <MenuItem value={"out"}>Out</MenuItem>
            </Select>
          </FormControl><br /><br />
          <Button type='submit' variant="contained" sx={{width: '100%', p: 1}} >Add Transaction</Button>
        </Box>
      </Modal>

      <Container>
          <Box sx={{ mb: 1, mt: 15, display:'flex', justifyContent: {sm:'space-between', xs:'center'}, flexDirection: {xs:'column', sm:'row'} }}>
            <Typography variant="h4" component="h1" sx={{ m: {sm:3, xs:"auto"} , fontWeight: 'bold' }} color={"primary.dark"}>
              Transactions
            </Typography>
            <Button variant="contained" sx={{ m: 3 }} onClick={modalOpen} >
              Add Transaction
            </Button>
          </Box>
          <Box sx={{ mb: 3 , mt: 1, width: '100%' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="styled table">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.main" }}>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} >No.</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} >Product</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">SKU</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">Note</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">Quantity</TableCell>
                    <TableCell sx={{ color: "primary.contrastText", fontWeight: 700 }} align="right">Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index)=>(
                  <TableRow key={transaction._id} sx={{"&:nth-of-type(odd)": { backgroundColor: "#fafafa" },"&:hover": { backgroundColor: "#f0f0f0" }}}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{transaction.productId?.name}</TableCell>
                    <TableCell align="right">{transaction.productId?.sku}</TableCell>
                    <TableCell align="right">{transaction.note}</TableCell>
                    <TableCell align="right">{transaction.quantity}</TableCell>
                    <TableCell align="right">{transaction.type}</TableCell>
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
