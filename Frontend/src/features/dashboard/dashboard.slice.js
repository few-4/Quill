import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
    workspace: null
    },
    reducers: {
        setWorkspace: (state, action) => {
            console.log(action.payload)
            state.workspace = action.payload;
        }
    }
})

export const { setWorkspace } = dashboardSlice.actions;
export default dashboardSlice.reducer;