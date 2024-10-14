// import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
// import enquiryService from "./enquiryService";

// export const getEnquiries = createAsyncThunk(
//   "enquiry/get-enquiries",
//   async (thunkAPI) => {
//     try {
//       return await enquiryService.getEnquiries();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const deleteAEnquiry = createAsyncThunk(
//   "enquiry/delete-enquiry",
//   async (id, thunkAPI) => {
//     try {
//       return await enquiryService.deleteEnquiry(id);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );
// export const getAEnquiry = createAsyncThunk(
//   "enquiry/get-enquiry",
//   async (id, thunkAPI) => {
//     try {
//       return await enquiryService.getEnquiry(id);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const updateAEnquiry = createAsyncThunk(
//   "enquiry/update-enquiry",
//   async (enq, thunkAPI) => {
//     try {
//       return await enquiryService.udpateEnquiry(enq);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const resetState = createAction("Reset_all");

// const initialState = {
//     enquiries: [],
//     isError: false,
//     isLoading: false,
//     isSuccess: false,
//     message: "",
// };

// export const enquirySlice = createSlice({
//   name: "enquiries",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//       builder
//         .addCase(getEnquiries.pending,(state) => {
//           state.isLoading = true;
//         })
//         .addCase(getEnquiries.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.isError = false;
//             state.isSuccess = true;
//             state.enquiries = action.payload;
//         })
//         .addCase(getEnquiries.rejected, (state, action) => {
//             state.isLoading = false;
//             state.isError = true;
//             state.isSuccess = false;
//             state.message = action.error;
//         })
//         .addCase(deleteAEnquiry.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(deleteAEnquiry.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isError = false;
//           state.isSuccess = true;
//           state.deletedEnquiry = action.payload;
//         })
//         .addCase(deleteAEnquiry.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(getAEnquiry.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(getAEnquiry.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isError = false;
//           state.isSuccess = true;
//           state.enqName = action.payload.name;
//           state.enqMobile = action.payload.mobile;
//           state.enqEmail = action.payload.email;
//           state.enqComment = action.payload.comment;
//           state.enqStatus = action.payload.status;
//         })
//         .addCase(getAEnquiry.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(updateAEnquiry.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(updateAEnquiry.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isError = false;
//           state.isSuccess = true;
//           state.updatedEnquiry = action.payload;
//        //   state.enqStatus = action.payload.status;
//         })
//         .addCase(updateAEnquiry.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })  
//         .addCase(resetState, () => initialState);
//   },
// });
// export default enquirySlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import enquiryService from "./enquiryService";

export const getEnquiries = createAsyncThunk(
  "enquiry/get-enquiries",
  async (_, thunkAPI) => {
    try {
      return await enquiryService.getEnquiries();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAEnquiry = createAsyncThunk(
  "enquiry/get-enquiry",
  async (id, thunkAPI) => {
    try {
      return await enquiryService.getEnquiry(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAEnquiry = createAsyncThunk(
  "enquiry/update-enquiry",
  async (enq, thunkAPI) => {
    try {
      return await enquiryService.updateEnquiry(enq);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAEnquiry = createAsyncThunk(
  "enquiry/delete-enquiry",
  async (id, thunkAPI) => {
    try {
      return await enquiryService.deleteEnquiry(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  enquiries: [],
  enquiry: {},
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    resetState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEnquiries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEnquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.enquiries = action.payload;
      })
      .addCase(getEnquiries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getAEnquiry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAEnquiry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.enquiry = action.payload;
      })
      .addCase(getAEnquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateAEnquiry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAEnquiry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.enquiries = state.enquiries.map((enquiry) =>
          enquiry._id === action.payload._id ? action.payload : enquiry
        );
      })
      .addCase(updateAEnquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteAEnquiry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAEnquiry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.enquiries = state.enquiries.filter(
          (enquiry) => enquiry._id !== action.payload._id
        );
      })
      .addCase(deleteAEnquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { resetState } = enquirySlice.actions;
export default enquirySlice.reducer;