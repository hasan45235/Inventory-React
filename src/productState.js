import { useState } from "react";
import ProductContext from "./productcontext";

const ProductState = (props) => {

    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const API = "https://inventory-backend-pink-nu.vercel.app/"


    const delProduct = async (id,progress) => {
      const response = await fetch(`${API}products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        fetchnotes(progress);
      }
    }

    const updateProduct = async (id, product , progress) => {
      progress(30)
      const response = await fetch(`${API}products/${id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({name: product.name, sku: product.sku, unitPrice: product.price, quantity: product.quantity})
      })
      progress(60)
      // eslint-disable-next-line
      let data = await response.json();
      progress(100)

      fetchnotes(progress);
    }

    const addProduct = async (product , progress) => {
      const response = await fetch(`${API}products`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({name: product.name, sku: product.sku, unitPrice: product.price, quantity: product.quantity})
      })
      // eslint-disable-next-line
      let data = await response.json();
      
      fetchnotes(progress);

    }

    const fetchnotes = async(progress) =>{
        // Fetch notes from an API_P
        progress(30);
        let response = await fetch(`${API}products`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        progress(60);
        
        let data =await response.json();
        progress(100);
        setProducts(data);
    }
    
    const fetchTransactions = async ( progress)=>{
      progress(30);
      let response = await fetch(`${API}transactions`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
      })
      progress(60);
      let data = await response.json();
      progress(100);
      setTransactions(data);
    }

    const addTransaction = async( data, progress)=>{
      progress(30);
      const response = await fetch(`${API}transactions`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          productId: data.product,
          quantity: data.quantity,
          note: data.note,
          type: data.type
        })
      })
      progress(60)
      // eslint-disable-next-line
      let res = await response.json();
      progress(100)
      
      fetchTransactions(progress);
      fetchnotes(progress);
    }

    
  return (
    <ProductContext.Provider value={{ fetchnotes, products, addProduct, delProduct, updateProduct , fetchTransactions, transactions, addTransaction }}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;
