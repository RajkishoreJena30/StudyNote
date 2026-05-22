import { createSlice } from '@reduxjs/toolkit';
import type { Post } from "../types/posts";
import { fetchPosts, fetchAllPosts } from "./postsThunks";

export  interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
}


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // Define your reducers here
        addAnewPost: (state, action) => {
            state.posts.push(action.payload);
        },
        removeAPost: (state, action) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
                    // FETCH POSTS
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })

            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error";
            })
            // FETCH ALL POSTS
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })

            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error";
            });
    }
});

export const { addAnewPost, removeAPost } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;