import CommentForm from "./CommentForm";
import "../../Components/comments/comments.css";

const Comment = ({
  comment,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) => {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
    const user=localStorage.getItem('user');
    const ourUser=JSON.parse(user);
    console.log(ourUser.id)
  // const fiveMinutes = 300000;
  // const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canDelete = currentUserId === comment.userId 
  const canEdit = currentUserId === comment.userId
  const createdAt = new Date(comment.Create_Time).toLocaleDateString();
  return (
    <div key={comment.id} className="comment">
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.name}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className="comment-text">{comment.Text}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className="comment-actions">
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
