import { createSlice } from "@reduxjs/toolkit";

export const workSpaceSlice = createSlice({
    name: 'workspace',
    initialState: {
        currentWorkspace: null || [] // can be a workspace object or an array of workspace objects
    },
    reducers: {
        setCurrentWorkspace: (state, action) => {
            state.currentWorkspace = action.payload;
        }
    }
})

export const { setCurrentWorkspace } = workSpaceSlice.actions;
export default workSpaceSlice.reducer;