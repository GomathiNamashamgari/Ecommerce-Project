import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { deleteCoupon, getAllCoupons } from "../../../State/customer/CouponSlice";
import { Coupon } from "../../../types/CouponTypes";


const StyledHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
}));

const CouponTable = () => {
  const dispatch = useAppDispatch();
  const { coupons } = useAppSelector((store) => store.coupons);
  const jwt = localStorage.getItem("jwt") || "";

  useEffect(() => {
    dispatch(getAllCoupons(jwt));
  }, [dispatch, jwt]);

  const handleDelete = (id: number) => {
    dispatch(deleteCoupon({ id, jwt }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledHeadCell>Code</StyledHeadCell>
            <StyledHeadCell>Start Date</StyledHeadCell>
            <StyledHeadCell>End Date</StyledHeadCell>
            <StyledHeadCell>Min Order</StyledHeadCell>
            <StyledHeadCell>Discount %</StyledHeadCell>
            <StyledHeadCell align="right">Delete</StyledHeadCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {coupons.map((coupon: Coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.validityStartDate}</TableCell>
              <TableCell>{coupon.validityEndDate}</TableCell>
              <TableCell>{coupon.minimumOrderValue}</TableCell>
              <TableCell>{coupon.discountPercentage}%</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleDelete(coupon.id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CouponTable;

