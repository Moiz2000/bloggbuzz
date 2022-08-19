import { useState, useEffect } from "react";
import CommentForm from "../../Components/comments/CommentForm";
import Comment from "../../Components/comments/Comment";
import "../../Components/comments/comments.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Comments = ({ commentsUrl, currentUserId }) => {
  const location = useLocation();
  const Id = location.pathname.split("/")[2];
  console.log(Id);
  const token = localStorage.getItem('token');
  //let length=null;
  const user = localStorage.getItem('user');
  const ourUser = JSON.parse(user);
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);

  const addComment = async (Text, parentId) => {
    const commentdata = {
      Text
    }
    try {
      await axios.post("https://blogbuzz-team4.herokuapp.com/user/blog/" + Id + "/comment", commentdata, {
        headers: ({
          Authorization: 'Bearer ' + token
        })
      })
      setActiveComment(null);
    }
    catch (err) {

    }

  };

  const updateComment = async (Text, commentId) => {
    const commentdata = {
      Text
    }
    try {
      await axios.patch("https://blogbuzz-team4.herokuapp.com/user/blog/" + Id + "/comment/" + commentId, commentdata, {
        headers: ({
          Authorization: 'Bearer ' + token
        })
      })
      setActiveComment(null);
    }
    catch (err) {
      window.alert("Something went wrong");
    }


  };
  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      try {
        await axios.delete("https://blogbuzz-team4.herokuapp.com/user/blog/" + Id + "/comment/" + commentId, {
          headers: ({
            Authorization: 'Bearer ' + token
          })
        })
      }
      catch (err) {
        window.alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const Getcomment = async () => {
      try {
        await axios.get("https://blogbuzz-team4.herokuapp.com/blog/" + Id + "/comment").then((response) => {
          console.log(response.data)
          setBackendComments(response.data);
        });
      }
      catch (err) {
        window.alert("Something went wrong");
      }
    }
    Getcomment();
  }, [Id, addComment, deleteComment, updateComment])
  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      {/* <div className="comment-form-title">Write comment</div> */}
      <div className="comments-container">
        {backendComments.map((backend) => (
          <Comment
            key={backend.id}
            comment={backend}
            //replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={ourUser.id}
          />
        ))}
        <CommentForm submitLabel="Write" handleSubmit={addComment} />
      </div>
    </div>
  );
};

export default Comments;
