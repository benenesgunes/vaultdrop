import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router";
import axios from "axios";

export default function MyFiles() {
    const [ files, setFiles ] = useState();
    const [ uploadedFile, setUploadedFile ] = useState();
    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();

    const API_BASE = "http://localhost:5000/api";

    useEffect(() => {
        if(!token) {
            navigate("/signup");
        }
    }, [])

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${API_BASE}/upload/files`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setFiles(response.data);
                console.log("files fetched successfully");
            }
            catch(error) {
                console.log(error);
            }
        }

        fetchFiles();
    }, [token])

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE}/upload/files/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("file deleted");
            location.reload();
        }
        catch(error) {
            console.log(error);
            alert("Teknik bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    }

    const handleUpload = async () => {
        if(!uploadedFile) return;

        const formData = new FormData();
        formData.append("file", uploadedFile);

        try {
            const response = await axios.post(`${API_BASE}/upload/files`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("upload succesful")
            location.reload();
        }
        catch(error) {
            console.log("something went wrong while uploading", error);
            alert("Teknik bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    }

    return(
        <>
            {token ?
                <>
                    <div className="w-full p-4 md:p-6 lg:p-8 flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl">
                            Dosyalarım
                        </h1>
                        <input id="fileInput" type="file" className="hidden" onChange={(e) => setUploadedFile(e.target.files[0])} />
                        {!uploadedFile ? 
                            <label htmlFor="fileInput" className="bg-light-button dark:bg-dark-button p-2 md:p-3 lg:p-4 md:text-lg lg:text-xl rounded-2xl md:rounded-3xl hover:bg-light-button/80 dark:hover:bg-dark-button/80 cursor-pointer">
                                Dosya Seç
                            </label>
                            :
                            <div className="absolute top-1/2 left-1/2 transform -translate-1/2 z-[10]
                                            bg-light-card dark:bg-dark-card
                                            p-4 md:p-6 lg:p-8
                                            flex flex-col items-center gap-y-4 md:gap-y-6 lg:gap-y-8
                                            rounded-2xl shadow-2xl">
                                <p className="md:text-lg lg:text-xl">
                                    {uploadedFile.name}
                                </p>
                                <div className="flex gap-x-4 md:gap-x-6 lg:gap-x-8">
                                    <button className="delete-button" onClick={() => setUploadedFile(null)}>
                                        Vazgeç
                                    </button>
                                    <button className="primary-button" onClick={handleUpload}>
                                        Yükle
                                    </button>
                                </div>
                            </div>    
                        }
                    </div>
                    <div className="p-4 md:p-6 lg:p-8 flex flex-wrap gap-4 md:gap-6 lg:gap-8">
                        {files?.map((file) => (
                            <div key={file.id} className="bg-light-card/80 dark:bg-dark-card/80 border-light-border size-24 md:size-26 lg:size-28 p-3 md:p-3 lg:p-4 flex flex-col justify-between items-center rounded-2xl shadow-xl relative">
                                <FaFile className="size-10 md:size-11 lg:size-12" />
                                <a href={`http://localhost:5000/uploads/${file.user_id}/${file.filename}`} title={file.originalname} className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-center">
                                    {file.originalname}
                                </a>
                                <MdDelete onClick={() => handleDelete(file.id)} className="text-light-text/30 dark:text-dark-text/30 absolute top-0 right-0 hover:text-delete transition-all text-xl md:text-2xl m-1.5 md:m-2 cursor-pointer" />
                            </div>
                        ))}
                    </div>
                </>
                :
                null
            }
        </>
    )
}