import { createSlice } from "@reduxjs/toolkit";
import { find, remove, some } from "lodash";

import { CommentLesson } from "@/shared/types/comment";
import {
  createCommentAsync,
  deleteCommentAsync,
  deleteMultipleCommentAsync,
  getAllCommentsAsync,
  getAllCommentsByLessonAsync,
  getAllRepliesAsync,
  updateCommentAsync,
} from "./action";

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isReplyLoading: false,
  isSuccess: true,
  isError: false,
  message: "",
  typeError: "",
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: "",
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: "",
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: "",
  comments: [] as CommentLesson[],
  pagination: {
    total_count: 0,
    total_pages: 0,
  },
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    resetInitialState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = "";
      state.typeError = "";
      state.isSuccessCreateEdit = false;
      state.isErrorCreateEdit = true;
      state.messageErrorCreateEdit = "";
      state.isSuccessDelete = false;
      state.isErrorDelete = true;
      state.messageErrorDelete = "";
      state.isSuccessMultipleDelete = false;
      state.isErrorMultipleDelete = true;
      state.messageErrorMultipleDelete = "";
    },

    setComments(state, action) {
      state.comments = action.payload;
    },
    setReactionComment(state, action) {
      const { commentId, parentId, kind, data } = action.payload;

      const findAndUpdateReaction = (comment: CommentLesson) => {
        if (!comment.reactions) {
          comment.reactions = [];
        }
        const reactionIndex = comment.reactions.findIndex(
          (r) => r._id === data._id,
        );

        if (reactionIndex !== -1) {
          if (kind === "isDelete") {
            comment.reactions.splice(reactionIndex, 1);
          } else if (kind === "isUpdate") {
            comment.reactions[reactionIndex] = data;
          }
        } else {
          comment.reactions.push(data);
        }
      };

      if (parentId) {
        // Reply comment
        const parentComment = state.comments.find((c) => c._id === parentId);
        const reply = parentComment?.replies?.find((r) => r._id === commentId);
        if (reply) {
          findAndUpdateReaction(reply);
        }
      } else {
        // Top-level comment
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          findAndUpdateReaction(comment);
        }
      }
    },

    addComment(state, action) {
      const { _id, parentId, ...data } = action.payload;

      if (parentId) {
        const parent = find(state.comments, { _id: parentId });
        if (parent) {
          parent.replies = parent.replies || [];

          if (!some(parent.replies, { _id })) {
            parent.replies.unshift(action.payload);
            parent.is_add_reply = true;
            parent.replies_count = (parent.replies_count ?? 0) + 1;
          }
        }
      } else {
        if (!some(state.comments, { _id })) {
          state.comments.unshift({ ...data, _id, replies: [] });
          state.pagination.total_count += 1;
        }
      }
    },
    editComment(state, action) {
      const { id, parentId, ...updatedFields } = action.payload;

      const updateIfExists = (item?: CommentLesson) => {
        if (item && item._id === id) {
          Object.assign(item, updatedFields);
        }
      };

      // Update parent or top-level comment
      const comment = state.comments.find((c) => c._id === id);
      updateIfExists(comment);

      // If it's a reply, update the reply inside the parent
      if (parentId) {
        const parentComment = state.comments.find((c) => c._id === parentId);
        const reply = parentComment?.replies?.find((r) => r._id === id);
        updateIfExists(reply);
      }
    },

    removeComment(state, action) {
      const { id, parentId } = action.payload;

      if (parentId) {
        const parent = find(state.comments, { _id: parentId });
        if (parent && Array.isArray(parent.replies)) {
          const removed = remove(parent.replies, (r) => r._id === id);
          if (removed.length > 0) {
            parent.replies_count = Math.max(
              (parent.replies_count ?? 1) - removed.length,
              0,
            );
          }
        }
      } else {
        const removed = remove(state.comments, (c) => c._id === id);
        if (removed.length > 0) {
          state.pagination.total_count = Math.max(
            state.pagination.total_count - removed.length,
            0,
          );
        }
      }
    },

    setShowReplyComment(state, action) {
      const { parentId, is_btn_reply } = action.payload;
      const commentIndex = state.comments.findIndex(
        (comment) => comment._id === parentId,
      );
      if (commentIndex !== -1) {
        const comment = state.comments[commentIndex];
        comment.is_btn_reply = is_btn_reply;
        comment.is_add_reply = false;
      }
    },
  },
  extraReducers: (builder) => {
    // Get all comments
    builder.addCase(getAllCommentsAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllCommentsAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.comments = action.payload.data?.comments;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllCommentsAsync.rejected, (state) => {
      state.isLoading = false;
      state.comments = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Get all comments by lesson
    builder.addCase(getAllCommentsByLessonAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllCommentsByLessonAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.comments = action.payload.data?.comments;
      state.pagination = action.payload.data.pagination;
    });

    builder.addCase(getAllCommentsByLessonAsync.rejected, (state) => {
      state.isLoading = false;
      state.comments = [];
      state.pagination = {
        total_count: 0,
        total_pages: 0,
      };
    });

    // Get all replies
    builder.addCase(getAllRepliesAsync.pending, (state) => {
      state.isReplyLoading = true;
    });

    builder.addCase(getAllRepliesAsync.fulfilled, (state, action) => {
      state.isReplyLoading = false;
      const { parentId, replies } = action.payload?.data;
      const commentIndex = state.comments.findIndex(
        (comment) => comment._id === parentId,
      );
      if (commentIndex !== -1) {
        const comment = state.comments[commentIndex];
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies = replies;
        comment.replies_count = (comment?.replies ?? []).length;
      }
    });

    builder.addCase(getAllRepliesAsync.rejected, (state) => {
      state.isReplyLoading = false;
      state.comments = [];
    });

    // Create role
    builder.addCase(createCommentAsync.pending, (state) => {
      state.isLoading = true;
      state.isSubmitting = true;
    });

    builder.addCase(createCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSubmitting = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Update role
    builder.addCase(updateCommentAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessCreateEdit = !!action.payload?.data?._id;
      state.isErrorCreateEdit = !action.payload?.data?._id;
      state.messageErrorCreateEdit = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete role
    builder.addCase(deleteCommentAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessDelete = !!action.payload?.data?._id;
      state.isErrorDelete = !action.payload?.data?._id;
      state.messageErrorDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });

    // Delete multiple comments
    builder.addCase(deleteMultipleCommentAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteMultipleCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccessMultipleDelete = !!action.payload?.data;
      state.isErrorMultipleDelete = !action.payload?.data;
      state.messageErrorMultipleDelete = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
  },
});

export const {
  resetInitialState,
  setComments,
  addComment,
  setReactionComment,
  editComment,
  removeComment,
  setShowReplyComment,
} = commentSlice.actions;
export default commentSlice.reducer;
