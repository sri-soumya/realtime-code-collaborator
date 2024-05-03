import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";

const store = configureStore({ reducer: { appSlice: appSlice } });

export default store;
