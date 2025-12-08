import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchSellerProducts } from '../../../State/seller/sellerProductSlice';
import { Product } from '../../../types/ProductTypes';
import { Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProductTables() {
  const dispatch = useAppDispatch();
  const sellerProduct = useAppSelector(state => state.sellerProduct);

  useEffect(() => {
       const jwt = localStorage.getItem('jwt');
       if (jwt) {
         dispatch(fetchSellerProducts(jwt)).then(() => {
           // Add notification on success
           if (sellerProduct.products.length > 0) {
             alert("Products loaded successfully"); // Or use a better notification library
           } else {
             alert("No products found. Add some!"); // Notification for empty
           }
         }).catch(() => {
           alert("Failed to load products"); // Notification on error
         });
       }
     }, [dispatch]);

     if (sellerProduct.loading) {
       return <CircularProgress />; // Show loading spinner
     }
     if (sellerProduct.error) {
       return <Typography color="error">Error: {sellerProduct.error}</Typography>; // Show error
     }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Images</StyledTableCell>
            <StyledTableCell align="right">Title</StyledTableCell>
            <StyledTableCell>MRP</StyledTableCell>
            <StyledTableCell>Selling Price</StyledTableCell>
            <StyledTableCell>Color</StyledTableCell>
            <StyledTableCell>Update Stock</StyledTableCell>
            <StyledTableCell>Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerProduct.products.length === 0 ? (
               <StyledTableRow>
                 <StyledTableCell colSpan={7} align="center">
                   <Typography>No products found. Add some!</Typography>
                 </StyledTableCell>
               </StyledTableRow>
             ) : (
               sellerProduct.products.map((item: Product) => (
                 <StyledTableRow key={item.id}>
                   <StyledTableCell component="th" scope="row">
                     <div className='flex gap-1 flex-wrap'>
                       {item.images?.map((img, index) => (
                         <img key={index} className='w-20 rounded-md' alt='' src={img} />
                       ))}
                </div>
                   </StyledTableCell>
                   <StyledTableCell align="right">{item.title}</StyledTableCell>
                   <StyledTableCell align="right">{item.mrpPrice}</StyledTableCell>
                   <StyledTableCell align="right">{item.sellingPrice}</StyledTableCell>
                   <StyledTableCell align="right">{item.color}</StyledTableCell>
                   <StyledTableCell align="right">
                     <Button size='small'>in_stock</Button>
                   </StyledTableCell>
                   <StyledTableCell align="right">
                     <IconButton color='primary' size='small'>
                       <Edit/>
                     </IconButton>
                   </StyledTableCell>
                 </StyledTableRow>
               ))
             )}
           </TableBody>
         </Table>
       </TableContainer>
     );
   }