import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "quill_access_token";

const persistedToken = localStorage.getItem(TOKEN_KEY);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      id: null,
      email: null,
      username: null,
      fullname: null,
    },
    accessToken: persistedToken || null,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      
      if (action.payload) {
        localStorage.setItem(TOKEN_KEY, action.payload);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
    setLoggedOut: (state) => {
      state.user = { id: null, email: null, username: null, fullname: null };
      state.accessToken = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setUser, setAccessToken, setLoggedOut } = authSlice.actions;

export default authSlice.reducer;
