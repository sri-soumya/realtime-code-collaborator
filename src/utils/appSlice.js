import { createSlice, current } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "appSlice",
  initialState: {
    selectedLanguage: null,
    code: null,
    input: null,
    output: null,
    languageVersion: null,
    showLoader: false,
    username: null,
    roomId: null,
    connectedUsers: [],
  },
  reducers: {
    addSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    addCode: (state, action) => {
      state.code = action.payload;
    },
    addInput: (state, action) => {
      state.input = action.payload;
    },
    addOutput: (state, action) => {
      state.output = action.payload;
    },
    addLanguageVersion: (state, action) => {
      state.languageVersion = action.payload;
    },
    addShowLoader: (state, action) => {
      state.showLoader = action.payload;
    },
    addUsername: (state, action) => {
      state.username = action.payload;
    },
    addRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    addConnectedUsers: (state, action) => {
      state.connectedUsers = action.payload;
    },
    removeConnectedUser: (state, action) => {
      state.connectedUsers = current(state).connectedUsers.filter((user) => {
        return (
          user.socketId !== action.payload.socketId ||
          user.username !== action.payload.username
        );
      });
    },
    setAllToDefault: (state) => {
      state.selectedLanguage = null;
      state.code = null;
      state.input = null;
      state.output = null;
      state.languageVersion = null;
      state.showLoader = false;
      state.username = null;
      state.roomId = null;
      state.connectedUsers = [];
    },
  },
});

export const {
  addSelectedLanguage,
  addCode,
  addInput,
  addOutput,
  addLanguageVersion,
  addShowLoader,
  addUsername,
  addRoomId,
  addConnectedUsers,
  removeConnectedUser,
  setAllToDefault,
} = appSlice.actions;
export default appSlice.reducer;
