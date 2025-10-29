import { useEffect, useState } from "react";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [Id, setId] = useState("");
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");
  const [Author, setAuthor] = useState("");

  const API_URL = "https://localhost:7245/blogs";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const createBlog = async (blog) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });

      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  const updateBlog = async (id, blog) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });

      if (!response.ok) throw new Error(await response.text());
      return true;
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        console.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Title || !Content || !Author) return;

    const blog = { title: Title, content: Content, author: Author };

    if (isEditing) {
      await updateBlog(Id, blog);
    } else {
      await createBlog(blog);
    }

    resetForm();
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setShowForm(true);
    setIsEditing(true);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author);
  };

  const resetForm = () => {
    setId("");
    setTitle("");
    setContent("");
    setAuthor("");
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="App">
      <h1>Blog Posts</h1>

      {!showForm && (
        <div>
          <button onClick={() => setShowForm(true)}>Add Blog</button>
          <hr />
          {blogs.length === 0 ? (
            <p>No blogs available.</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} style={{ marginBottom: "20px" }}>
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <small>
                  By {blog.author} |{" "}
                  {new Date(blog.createdAt).toLocaleString()}
                </small>
                <br />
                <button onClick={() => handleEdit(blog)}>Edit</button>{" "}
                <button
                  onClick={() => deleteBlog(blog.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
                <hr />
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>{isEditing ? "Edit Blog" : "Add New Blog"}</h2>

          {isEditing && (
            <input
              type="text"
              value={Id}
              readOnly
              placeholder="ID"
              style={{ backgroundColor: "#f2f2f2" }}
            />
          )}

          <input
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <br />

          <textarea
            value={Content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            required
          />
          <br />

          <input
            value={Author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
          />
          <br />

          <button type="submit">{isEditing ? "Update" : "Create"}</button>{" "}
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
