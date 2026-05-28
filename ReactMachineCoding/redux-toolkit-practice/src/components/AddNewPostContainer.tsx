import { useState } from "react";
import { useDispatch} from "react-redux";
import { addAnewPost } from "../store/postsReducer";
import type { AppDispatch } from "../store/store";

const AddNewPostContainer = () =>{
    const dispatch = useDispatch<AppDispatch>();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const handleSubmit = (  e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!title.trim() || !body.trim()){
            alert("Title and Body are required");
            return;
        }
        dispatch(addAnewPost({ title, body, id: Date.now() }));
        setTitle("");
        setBody("");
    }

    return(
        <div className="add-new-post-container">
            <h2>Add New Post</h2>
           <form onSubmit={handleSubmit} className="new-post-form">
              <input type="text" placeholder="Title" className="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea rows={7} placeholder="Body" className="body" value={body} onChange={(e)=>setBody(e.target.value)}></textarea>
              <button className="submit-button" type="submit">Add Post</button>            
           </form>
        </div>
    )
}

export default AddNewPostContainer;