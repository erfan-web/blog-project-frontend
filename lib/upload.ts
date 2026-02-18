const upload = async (file: File | undefined) => {
  if (!file) return;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "nextjs-blog");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/erfan/image/upload",
      {
        method: "POST",
        body: data,
      },
    );
    const { url } = await res.json();
    return url;
  } catch (err) {
    return null;
  }
};
export default upload;
