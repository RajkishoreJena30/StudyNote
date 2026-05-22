
import React from "react";
import {useSelector} from  "react-redux";
import type { RootState } from "../store/store";
import type { Post } from "../types/posts";
import { fetchAllPosts } from "../store/postsThunks";

const Posts = () => {
    const posts = useSelector((state: RootState) => state.posts.posts);

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
        </div>
    )
};

export default Posts;