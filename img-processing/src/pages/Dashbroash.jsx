import React from 'react'
import Card from '../components/Card'
import { motion, useScroll } from "framer-motion";
const Dashbroash = () => {
    const { scrollYProgress } = useScroll();
    return (
        <>
            <motion.div
                className="fixed top-0 right-0 left-0 h-[10px] bg-cyan-400 origin-[0%]"
                style={{ scaleX: scrollYProgress }}
            />
            <motion.div className='flex flex-col gap-10 scroll-mt-28 mt-[250px]'
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.175 }}
            >
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </motion.div>
        </>

    )
}

export default Dashbroash