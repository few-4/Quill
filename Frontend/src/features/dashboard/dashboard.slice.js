import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        workspace: null,
        unreadChat: false
    },
    reducers: {
        setWorkspace: (state, action) => {
            state.workspace = action.payload;
        },
        setUnreadChat: (state, action) => {
            state.unreadChat = action.payload;
        }
    }
})

export const { setWorkspace, setUnreadChat } = dashboardSlice.actions;
export default dashboardSlice.reducer;