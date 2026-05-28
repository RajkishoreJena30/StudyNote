
import React, { useEffect } from "react";
import {useSelector, useDispatch} from  "react-redux";
import type { RootState,AppDispatch} from "../store/store";
import type { Post } from "../types/posts";
import { fetchAllPosts } from "../store/postsThunks";

const Posts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {posts,error, loading} = useSelector((state: RootState) => state.posts);

    useEffect(()=>{
        dispatch(fetchAllPosts());
    },[dispatch])
    return(
        <div className="post-list-container" >
            <h3>Posts</h3>
            {posts &&  posts.map((post:Post)=>{
                return(
                    <div key={post.id} className="post-item">
                        <h4>{post.title}</h4>
                        <p>{post.body}</p>
                    </div>
                )
            })}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    )
};

export default Posts;