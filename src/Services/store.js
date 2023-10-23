import { configureStore,getDefaultMiddleware } from "@reduxjs/toolkit";
import { shiftApi } from "./shiftApi";
export const store = configureStore({
    reducer:{
      [shiftApi.reducerPath]:shiftApi.reducer
    },
    middleware:(getDefaultMiddleware)=>{
       return getDefaultMiddleware().concat(shiftApi.middleware)
    }
});