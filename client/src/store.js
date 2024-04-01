import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice.js';

export default configureStore({
    reducer: {
        user: userReducer,
    },
});
