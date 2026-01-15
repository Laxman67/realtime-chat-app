import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axios';
import { connectSocket } from '../../lib/socket';

export const getUser = createAsyncThunk('user/me', async (_, thunkAPI) => {
  try {
    const response = axiosInstance.get('/user/me');
    console.log(response);

    connectSocket(response.data?.user);
    return response.data?.user;
  } catch (error) {
    console.log('Error in fetching user ', error);
    return thunkAPI.rejectWithValue(
      error.response?.data || 'Filed to fetch data'
    );
  }
});
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUser: [],
  },
  reducers: {
    setOnlineUser(state, action) {
      state.onlineUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      });
  },
});

export const { setOnlineUser } = authSlice.actions;
export default authSlice.reducer;
