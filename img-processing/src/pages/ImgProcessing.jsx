import React, { useEffect, useState } from 'react';
import ImgProcessing from '../components/ImgProcessing/index'
import { Link } from 'react-router-dom';

const ImgProcessingPage = () => {

    return (
        <>

            <section className='p-10'>
                <div className='flex justify-start items-center'>
                    <Link to={'/'} className='px-4 py-3 bg-black border text-white rounded-xl hover:bg-white hover:text-black transition-all '>Back</Link>
                </div>
                <ImgProcessing />
            </section>
        </>
    );
};

export default ImgProcessingPage;
