// src/admin/Pages/Seller/SellerTable.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchAllSellers, updateSellerStatus } from "../../../State/admin/adminSellerSlice";
import { Seller } from "../../../types/SellerTypes";

// ----------------------
// Styled Components
// ----------------------
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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// ----------------------
// Account Status Options
// ----------------------
const accountStatusList = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banned" },
  { status: "CLOSED", title: "Closed" },
];

// ----------------------
// Component
// ----------------------
const SellerTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sellers, loading, error } = useAppSelector((state) => state.adminSeller);

  const [statuses, setStatuses] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    dispatch(fetchAllSellers());
  }, [dispatch]);

  const handleChange = (id: number, newStatus: string) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    dispatch(updateSellerStatus({ id, status: newStatus }));
  };

  return (
    <div>
      {error && <div className="text-red-500 p-2">{error}</div>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell align="right">Mobile</StyledTableCell>
              <StyledTableCell align="right">GSTIN</StyledTableCell>
              <StyledTableCell align="right">Business Name</StyledTableCell>
              <StyledTableCell align="right">Account Status</StyledTableCell>
              <StyledTableCell align="right">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  Loading...
                </StyledTableCell>
              </StyledTableRow>
            )}

            {!loading && sellers.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No sellers found
                </StyledTableCell>
              </StyledTableRow>
            )}

            {!loading &&
              sellers
                .filter((profile) => profile.id != null)
                .map((profile: Seller) => {
                  const sellerId = Number(profile.id);
                  return (
                    <StyledTableRow key={sellerId}>
                      <StyledTableCell>{profile.sellerName}</StyledTableCell>
                      <StyledTableCell>{profile.email}</StyledTableCell>
                      <StyledTableCell align="right">{profile.mobile}</StyledTableCell>
                      <StyledTableCell align="right">{profile.GSTIN}</StyledTableCell>
                      <StyledTableCell align="right">{profile.businessDetails.businessName}</StyledTableCell>
                      <StyledTableCell align="right">{profile.accountStatus || "ACTIVE"}</StyledTableCell>

                      <StyledTableCell align="right">
                        <Select
                          size="small"
                          value={statuses[sellerId] || profile.accountStatus || "ACTIVE"}
                          onChange={(e: SelectChangeEvent<string>) =>
                            handleChange(sellerId, e.target.value)
                          }
                        >
                          {accountStatusList.map((item) => (
                            <MenuItem key={item.status} value={item.status}>
                              {item.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SellerTable;
