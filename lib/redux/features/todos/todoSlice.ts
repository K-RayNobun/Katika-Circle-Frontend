import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  avatar: string;
}
interface currentUserState {
  user: User;
}

const initialState: currentUserState = {
  user: {
    id: "",
    name: "",
    avatar: "",
  },
};

const currentUser = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setCurrentUser } = currentUser.actions;
export default currentUser.reducer;