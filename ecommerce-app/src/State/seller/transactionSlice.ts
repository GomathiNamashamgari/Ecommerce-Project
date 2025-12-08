import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Transaction } from "../../types/TransactionTypes";

interface TransactionState {
    transactions: Transaction[];
    transaction: Transaction | null;
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    transaction: null,
    loading: false,
    error: null,
};

export const fetchTransactionsBySeller = createAsyncThunk<
    Transaction[],string,{ rejectValue: string }>
    ( `transactions/fecthTransactionsBySeller`,
        async (jwt, { rejectWithValue }) => {
            try{
                const response = await api.get(`/api/transaction/seller`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    },
                });
                console.log("fetch transactions by seller ",response.data);
                return response.data;
            } catch (error: any) {
                if (error.response){
                    return rejectWithValue(error.response.data.message);
                }
                return rejectWithValue("Failed to fetch transactions");
            }
        });

export const fetchTransctions = createAsyncThunk<
Transaction[],
void,
{ rejectValue: string }
>(`transactions/fetchTransactions`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/transaction`,);
            console.log("fetch all transactions ", response.data);
            return response.data;
        }
        catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue("Failed to fetch transactions");
        }
});

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTransactionsBySeller.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTransactionsBySeller.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        });
        builder.addCase(fetchTransactionsBySeller.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(fetchTransctions.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTransctions.fulfilled, (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        });
        builder.addCase(fetchTransctions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
})

export default transactionSlice.reducer;