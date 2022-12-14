import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Singlepost.css";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import axios from 'axios';

export default function SinglePost() {
  const navigate = useNavigate()
  const user = localStorage.getItem('user');
  const location = useLocation();
  const Id = location.pathname.split("/")[2];
  const token = localStorage.getItem('token');
  const [blog, setBlog] = useState([])
  const ourUser = JSON.parse(user);
  console.log(ourUser);
  // const canUpdate= ourUser.name===blog.UserName;
  const [Title, setTitle] = useState()
  const [Text, setText] = useState()
  const [updateMode, setUpdateMode] = useState(false);
  const [like, setLike] = useState(false);
  // const [cat,setCat]=useState([]);
  useEffect(() => {
    const FetchBlog = async () => {
      const response = await axios.get("https://blogbuzz-team4.herokuapp.com/blog/" + Id)
      console.log(response)
      setBlog(response.data[0])
      setTitle(response.data[0].Title);
      setText(response.data[0].Text);
    }
    FetchBlog()
  }, [Id])

  useEffect(() => {
    const GetLike = async (e) => {
      try {
        console.log(ourUser.id)
        await axios.get("https://blogbuzz-team4.herokuapp.com/user/" + ourUser.id + "/blog/" + Id).then((response) => {
          console.log(response.data.length())
          // if(response.data.length>0){
          setLike(true);
          // }
        })
      }
      catch (err) {
        //window.alert("Something went wrong1");
      }
    }
    GetLike();
  }, [Id])
  // useEffect(()=>{
  //   const FetchPost = async()=>{
  //     const response=await axios.get("https://blogbuzz-team4.herokuapp.com/blog/blogtag/"+Id)
  //     console.log(response)
  //     setCat(response.data)
  //   }
  //   FetchPost()
  // },[Id])
  const handleDelete = async (e) => {
    e.preventDefault()
    if (window.confirm("Are you sure you want to remove comment?")) {
      try {
        await axios.delete("https://blogbuzz-team4.herokuapp.com/user/blog/" + blog.id, {
          headers: ({
            Authorization: 'Bearer ' + token
          })
        })
        navigate('/homepage');
      }
      catch (err) {
        window.alert("Can't delete. Something went wrong")
      }
    }
  }
  const handleUpdate = async (e) => {
    const data = {
      Title,
      Text
    }
    try {
      await axios.patch("https://blogbuzz-team4.herokuapp.com/user/blog/" + blog.id, data, {
        headers: ({
          Authorization: 'Bearer ' + token
        })
      })
      setUpdateMode(false);

    }
    catch (err) {
      window.alert("Something went wrong2")

    }
  }
  const handleLike = async (e) => {
    const data = {
      Like_status: true
    }
    try {
      await axios.post("https://blogbuzz-team4.herokuapp.com/user/blog/" + Id + "/blog_like", data, {
        headers: ({
          Authorization: 'Bearer ' + token
        })
      }).then((response) => {
        console.log(response.data)
        setLike(true);
      })
    }
    catch (err) {
      window.alert("Something went wrong3");
    }
  }
  const handleUnLike = async (e) => {
    if (window.confirm("Are you sure you want to unlike this blog")) {
      try {
        await axios.delete("https://blogbuzz-team4.herokuapp.com/user/blog/" + Id + "/blog_like", {
          headers: ({
            Authorization: 'Bearer ' + token
          })
        }).then((response) => {
          console.log(response.data)
          setLike(false);
        })
      }
      catch (err) {
        window.alert("Something went wrong4");
      }
    }
  }

  return (
    <div className="singlePost">
      {/* <br /> */}
      <div className="singlePostWrapper">
        <div className="grid">
          {updateMode ? <input type="text" value={Title} className="singlePostTitleInput" autoFocus /> : (
            <h1 className="singlePostTitle">
              {blog.Title} </h1>
          )}
          <span className="postCat"> Category:
            <Link className="link" to={`/homepage?cat=${blog.TagName}`}>
              {blog.TagName}
            </Link>
          </span>
          <br />
          <div className="comment-image-contaierr">
            <Avatar alt={`${blog.UserName}`} className="imgg" src="/static/images/avatar/2.jpg" />
            <div className="comment-right-partt">
              <div className="comment-contentt">
                <Link className="link" to={`/homepage?user=${blog.UserName}`}>
                  <div className="comment-authorr">{blog.UserName}</div>
                </Link>
                <div>{new Date(blog.Create_Time).toDateString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="singlePostEdit">
          {
            user && ourUser.name === blog.UserName &&
            <ul>
              <i className="singlePostIcon far fa-edit" onClick={() => setUpdateMode(true)}></i>
              <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
            </ul>}
        </div>
        <img className="singlePostImg"
          src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        {updateMode ? <textarea className="singlePostDescInput" value={Text} onChange={(e) => setText(e.target.value)}
          autoFocus
        />
          : (
            <p className="singlePostDescInput">
              {blog.Text}
            </p>)}

        <hr />
        {
          updateMode &&
          <button className="singleClassButton" onClick={handleUpdate}>Update</button>
        }

        {
          user &&
          <ul>
            {like ?
              <Link onClick={handleUnLike} to="#"><i className="fa fa-heart fa-3x" aria-hidden="true" id="like" ></i></Link> :
              (<Link onClick={handleLike} to="#"><i className="fa fa-heart fa-3x" aria-hidden="true" id="like"></i></Link>)}
            <Link to={`/comments/${blog.id}`}><i class="fa fa-comment fa-3x" aria-hidden="true" id="comm"></i></Link>
          </ul>}

      </div>
    </div>
  );
}
