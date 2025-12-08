import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import store, { useAppDispatch, useAppSelector } from '../../../State/Store';
import { useEffect, useState } from 'react';
import { fetchSellerOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice';
import { Button, Menu, MenuItem } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const orderStatus = [
  { color: '#ffa500', label: 'PENDING' },
  { color: '#f5bcba', label: 'PLACED' },
  { color: '#f5bcba', label: 'CONFIRMED' },
  { color: '#87ceeb', label: 'SHIPPED' },
  { color: '#4caf50', label: 'DELIVERED' },
  { color: '#ff0000', label: 'CANCELLED' },
]
const orderStatusColor = {
  PENDING: { color: '#ffa500', label: 'PENDING' },
  PLACED: { color: '#f5bcba', label: 'PLACED' },
  CONFIRMED: { color: '#f5bcba', label: 'CONFIRMED' },
  SHIPPED: { color: '#87ceeb', label: 'SHIPPED' },
  DELIVERED: { color: '#4caf50', label: 'DELIVERED' },
  CANCELLED: { color: '#ff0000', label: 'CANCELLED' },
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



export default function OrderTables() {
  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector(store => store);

  useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""))
  },[]);

  const [anchorEl, setAnchorEl] = useState<null | any>({});
  const open = Boolean(anchorEl);
  const handleClick = (event: any, orderId:number) => {
    setAnchorEl((prev:any)=>({...prev, [orderId]: event.currentTarget}));
  };
  const handleClose = (orderId:number)=>() => {
    setAnchorEl((prev:any)=>({...prev, [orderId]: null}));
  };
    const handleUpadteOrderStatus = (orderId:number, orderStatus:any ) =>{
    dispatch(updateOrderStatus({jwt:localStorage.getItem("jwt") || "", orderId, orderStatus}));
    handleClose(orderId)();  // ← This is the only new line
  }
 
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order Id</StyledTableCell>
            <StyledTableCell>Products</StyledTableCell>
            <StyledTableCell align="right">Shipping Address</StyledTableCell>
            <StyledTableCell align="right">Order State</StyledTableCell>
            <StyledTableCell align="right">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerOrder.orders.map((item) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                {item.id}
              </StyledTableCell>
              <StyledTableCell >
                <div className='flex gap-1 flex-wrap'>

                  {item.orderItems.map((orderItems)=>
                  <div className='flex gap-5 items-center'>
                    <img className='w-20 rounded-md' src={orderItems.product.images[0]} alt="" />

                    <div className='flex flex-col justify-between py-2'>
                      <h1>Title: {orderItems.product.title}</h1>
                      <h1>Selling Price: ₹ {orderItems.product.sellingPrice}</h1>
                      <h1>Color: {orderItems.product.color}</h1>
                    </div>
                  </div>)}

                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div className='flex flex-col gap-y-2'>
                  <h1>{item.shippingAddress.name}</h1>
                  <h1>{item.shippingAddress.address}, {item.shippingAddress.city}</h1>
                  <h1>{item.shippingAddress.state} - {item.shippingAddress.pinCode}</h1>
                  <h1><strong>Mobile:</strong> {item.shippingAddress.mobile}</h1>
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <span className='px-5 py-2 border rounded-full border-primary-color text-primary-color'>{item.orderStatus}</span>
              </StyledTableCell>
               <StyledTableCell align="right">
  <Button
    id={`status-btn-${item.id}`}
    aria-controls={anchorEl[item.id] ? `status-menu-${item.id}` : undefined}
    aria-haspopup="true"
    aria-expanded={anchorEl[item.id] }
    onClick={(e) => handleClick(e, item.id)}
    variant="outlined"
    size="small"
  >
     Status
  </Button>

  <Menu
    id={`status-menu-${item.id}`}
    anchorEl={anchorEl[item.id] || null}
    open={Boolean(anchorEl[item.id])}
    onClose={()=> handleClose(item.id)()}
    slotProps={{
      list: {
      'aria-labelledby': `status-btn-${item.id}`,
      }
    }}
  >
    
    { orderStatus.map((status)=>
    <MenuItem key={status.label} onClick={()=> handleUpadteOrderStatus(item.id, status.label)}>{status.label}</MenuItem>
    
    )}
  </Menu>
</StyledTableCell>  
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}