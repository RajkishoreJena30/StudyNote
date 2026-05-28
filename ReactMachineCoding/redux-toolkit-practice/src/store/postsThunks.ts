import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Post } from "../types/posts";

interface FetchPostsResponse {
    posts: Post[];
}

export const fetchPosts = createAsyncThunk<
    Post[],
    string,
    { rejectValue: string }
>(
    "posts/fetchPosts",
    async (searchText, thunkAPI) => {
        try {
            const response = await fetch(
                `https://dummyjson.com/posts/search?q=${searchText}`
            );

            if (!response.ok) {
                return thunkAPI.rejectWithValue("Failed to fetch posts");
            }

            const data: FetchPostsResponse = await response.json();

            return data.posts;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(`Something went wrong ${error instanceof Error ? error.message : ""}`);
        }
    }
);

export const fetchAllPosts = createAsyncThunk<
    Post[],
    void,
    { rejectValue: string }
>(
    "posts/fetchAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await fetch("https://dummyjson.com/posts?limit=5");

            if (!response.ok) {
                return thunkAPI.rejectWithValue("Failed to fetch posts");
            }

            const data: FetchPostsResponse = await response.json();

            return data.posts;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(`Something went wrong ${error instanceof Error ? error.message : ""}`);
        }
    }
);

// export const createPost = createAsyncThunk<
//     Post,
//     Partial<Post>,
//     { rejectValue: string }
// >(
//     "posts/createPost",
//     async (newPost, thunkAPI) => {
//         try {
//             const response = await fetch(
//                 "https://dummyjson.com/posts/add",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(newPost),
//                 }
//             );

//             if (!response.ok) {
//                 return thunkAPI.rejectWithValue("Failed to create post");
//             }

//             const data: Post = await response.json();

//             return data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue("Something went wrong");
//         }
//     }
// );