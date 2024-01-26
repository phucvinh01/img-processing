import React, { useRef } from 'react'
import camera from '../../assets/icons8-camera-64.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, redirect } from 'react-router-dom'
const Card = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "1.33 1"],
    });

    const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
    return (
        <motion.div
            style={{
                scale: scaleProgess,
                opacity: opacityProgess,
            }}
            ref={ref}
        >
            <div class="m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-60 md:w-80 hover:scale-110 transition-all">
                <Link to={'/img-processing'} class="block w-full h-full">
                    <img alt="blog photo" src={camera} class="object-contain w-full max-h-40" />
                    <div class="w-full p-4 bg-white">
                        <p class="font-medium text-indigo-500 text-md">
                            Image Processing
                        </p>

                        <div class="flex flex-wrap items-center mt-4 justify-starts">
                            <div class="text-xs mr-2 py-1.5 px-4 text-gray-600 bg-blue-100 rounded-2xl">
                                #OpenCV
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    )
}

export default Card