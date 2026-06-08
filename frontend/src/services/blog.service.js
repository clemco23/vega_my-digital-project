import api from "./api";

export const getPublishedBlogs = async () => {
  const { data } = await api.get("/blogs");
  return data;
};

export const getPublishedBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data;
};

export const getBlogsAdmin = async () => {
  const { data } = await api.get("/blogs/admin");
  return data;
};

export const createBlog = async (blogData) => {
  const { data } = await api.post("/blogs", blogData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateBlog = async (id, blogData) => {
  const { data } = await api.patch(`/blogs/${id}`, blogData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/${id}`);
  return data;
};
