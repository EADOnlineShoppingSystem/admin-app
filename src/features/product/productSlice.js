import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import productService from "./productService";

export const createCategories = createAsyncThunk(
  "product/create-categories",
  async (formData, thunkAPI) => {
    try {
      const response = await productService.createCategory(formData);
      return response.category;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "product/get-categories",
  async (_, thunkAPI) => {
    try {
      return await productService.getCategories();
    } catch (error) {
      const message = error.message || 'Failed to fetch categories';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "product/update-category",
  async ({ categoryId, formData }, thunkAPI) => {
    try {
      return await productService.updateCategory(categoryId, formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createProducts = createAsyncThunk(
  "product/create-products",
  async (productData, thunkAPI) => {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "product/get-products",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      const message = error.message || 'Failed to fetch products';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProductsByACategory = createAsyncThunk(
  "product/get-products-category",
  async (categoryName, thunkAPI) => {
    try {
      return await productService.getProductsByCategory(categoryName);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAProductById = createAsyncThunk(
  "product/get-product",
  async (id, thunkAPI) => {
    try {
      return await productService.getAProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAProduct = createAsyncThunk(
  "product/update-product",
  async ({ productId, productData }, thunkAPI) => {
    try {
      return await productService.updateProduct(productId, productData);
    } catch (error) {
      const message = error.message || 'Failed to update product';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteAProduct = createAsyncThunk(
  "product/delete-product",
  async (id, thunkAPI) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    products: [],
    categories: [],
    currentProduct: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder
      .addCase(createCategories.pending,(state) => {
        state.isLoading = true;
      })
      .addCase(createCategories.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.categories = action.payload;
      })
      .addCase(createCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "An error occurred";
      })
      .addCase(getAllCategories.pending,(state) => {
        state.isLoading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.productCategories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

        .addCase(getAllProducts.pending,(state) => {
          state.isLoading = true;
        })
        .addCase(getAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.products = action.payload;
        })
        .addCase(getAllProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error;
        })

        .addCase(getProductsByACategory.pending,(state) => {
          state.isLoading = true;
        })
        .addCase(getProductsByACategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.productCat = action.payload;
        })
        .addCase(getProductsByACategory.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error;
        })

        .addCase(createProducts.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.createdProduct = action.payload;
        })
        .addCase(createProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(getAProductById.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAProductById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.currentProduct = action.payload;
        })
  
        .addCase(getAProductById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(updateAProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateAProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.updatedProduct = action.payload;
        })
        .addCase(updateAProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
        .addCase(deleteAProduct.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(deleteAProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedProduct = action.payload;
        })
        .addCase(deleteAProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.message = action.error;
        })
       .addCase(resetState, () => initialState);
  },
});
export const { reset } = productSlice.actions;
export default productSlice.reducer;
