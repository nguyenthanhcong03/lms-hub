import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user";
import courseReducer from "./course";
import lessonReducer from "./lesson";
import chapterReducer from "./chapter";
import orderReducer from "./order";
import couponReducer from "./coupon";
import reviewReducer from "./review";
import categoryReducer from "./category";
import trackReducer from "./track";
import cartReducer from "./cart";
import commentReducer from "./comment";

const rootReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  lesson: lessonReducer,
  chapter: chapterReducer,
  order: orderReducer,
  coupon: couponReducer,
  review: reviewReducer,
  category: categoryReducer,
  track: trackReducer,
  cart: cartReducer,
  comment: commentReducer,
});

export default rootReducer;
