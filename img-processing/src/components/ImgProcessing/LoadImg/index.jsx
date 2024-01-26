import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = (props) => {


    const { setFolder } = props

    const onDrop = (acceptedFiles) => {
        setFolder(acceptedFiles.map((file) => URL.createObjectURL(file)));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className={`w-100 h-[300px] flex items-center justify-center p-10 border rounded-3xl border-cyan-300 m-10 ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} accept="image/*" multiple />
            {isDragActive ? (
                <p className='text-2xl font-semibold cursor-pointer hover:scale-x-105 transition-all'>Kéo và thả các file hình ảnh vào đây...</p>
            ) : (
                <p className='text-2xl font-semibold cursor-pointer hover:scale-x-105 transition-all'>Kéo và thả hoặc click để chọn các file hình ảnh</p>
            )}

        </div>

    );
};

export default ImageUploader;