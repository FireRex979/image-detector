import axios from "axios";
import type { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    /* Prevent form from submitting by default */
    e.preventDefault();

    /* If file is not selected, then show alert message */
    if (!inputFileRef.current?.files?.length) {
      alert("Please, select file you want to upload");
      return;
    }

    setIsLoading(true);

    /* Add files to FormData */
    const formData = new FormData();
    Object.values(inputFileRef.current.files).forEach((file) => {
      formData.append("file", file);
    });

    // conver to axios
    const response = await axios.post(
      "http://dev.robologitech.com/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      setResult("http://dev.robologitech.com/detectedImage");
      alert("File uploaded successfully");

      const imagePreviewContainer = document.getElementById(
        "imagePreviewContainer"
      );

      if (imagePreviewContainer) {
        imagePreviewContainer.innerHTML = "";
      }
    }

    setIsLoading(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreviewContainer = document.getElementById(
          "imagePreviewContainer"
        );
        if (imagePreviewContainer) {
          imagePreviewContainer.innerHTML = `<img src="${e.target?.result}" class="w-full h-full object-cover rounded-lg" />`;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return !isLoading ? (
    // make container just phone screen only using tailwindcss
    <div className="container mx-auto p-4 w-[680px] h-[100vh] bg-white">
      <h1 className="text-2xl font-bold text-center text-black mb-5">
        Upload File
      </h1>
      {/* make box for preview image */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-black">Preview</h2>
        <div
          className="w-[100%] h-[400px] mb-5 bg-blue-300 rounded-lg"
          id="imagePreviewContainer"
        >
          <img
            src={result || "https://via.placeholder.com/400"}
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={inputFileRef}
          onChange={onFileChange}
          accept="image/*"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleOnClick}
          className="p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  ) : (
    <div className="backdrop">
      <div className="loading"></div>
    </div>
  );
};

export default Home;
