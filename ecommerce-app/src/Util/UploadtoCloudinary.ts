export const uploadToCloudinary = async (pics: File | null) => {
  const cloud_name = "dipoo6gie";
  const upload_preset = "ecommerce_uploads";

  if (!pics) {
    console.error("Error: pics not found");
    return null;
  }

  try {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);

    const res = await fetch(`https://api.cloudinary.com/v1_1/dipoo6gie/upload`, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cloudinary upload error:", errorData);
      return null;
    }

    const fileData = await res.json();
    return fileData.secure_url; // Use secure_url instead of url
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};
