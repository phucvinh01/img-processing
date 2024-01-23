import React, { useEffect, useRef, useState } from 'react';
import cv, { imshow } from '@techstark/opencv-js';
import second from '../../assets/template.png';

const HandleProsesing = (props) => {
    // const [template, setTemplate] = useState(null);
    // const [template2, setTemplate2] = useState(null);
    // useEffect(() => {
    //     // Đọc mẫu
    //     const img = new Image();
    //     img.src = second;
    //     img.onload = (e) => {
    //         setTemplate(e.target);
    //         setTemplate2(img.src)
    //     };
    // }, []);

    const { image, template, isShow } = props;

    //const [imagesWithContour, setImageWithContour] = useState([])

    const [result, setResult] = useState([]);
    const [show, setShow] = useState(false);

    const imagesWithContour = [];

    const cannyEdgeRef = useRef();
    // const roiEdgeRef = useRef()
    const roiRef0 = useRef();
    const roiRef1 = useRef();
    const roiRef2 = useRef();
    const roiRef3 = useRef();

    const regions = [
        { x: 40, y: 0, width: 40, height: 160 },
        { x: 150, y: 0, width: 40, height: 160 },
        { x: 95, y: 20, width: 30, height: 67 },
        { x: 60, y: 135, width: 100, height: 60 },
    ];

    let templ = cv.imread(template);

    const processImage = (image) => {
        const img = cv.imread(image);
        const imgGray = new cv.Mat();
        cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
        const edges = new cv.Mat();
        const edges2 = new cv.Mat();
        cv.Canny(imgGray, edges, 100, 100);
        cv.Canny(imgGray, edges2, 100, 100);

        regions.map((region) => {
            cv.rectangle(
                edges,
                new cv.Point(region.x, region.y),
                new cv.Point(region.x + region.width, region.y + region.height),
                [255, 0, 0, 255],
                2
            );
        });

        Promise.all(
            regions.map((region) => {
                const rect = new cv.Rect(
                    region.x,
                    region.y,
                    region.width,
                    region.height
                );
                try {
                    const roi = imgGray.roi(rect);
                    const e = new cv.Mat();
                    cv.Canny(roi, e, 100, 100);
                    imagesWithContour.push(e);
                } catch (error) {
                    console.error('Error extracting ROI:', error);
                }
            })
        );
        if (imagesWithContour.length === 4) {
            imagesWithContour.map(async (src, index) => {
                try {
                    if (index === 0) {
                        let contours = new cv.MatVector();
                        let hierarchy = new cv.Mat();
                        cv.findContours(
                            src,
                            contours,
                            hierarchy,
                            cv.RETR_EXTERNAL,
                            cv.CHAIN_APPROX_SIMPLE
                        ); // Adjusted mode
                        let maxContour = null;
                        let maxLength = 0;
                        for (let i = 0; i < contours.size(); ++i) {
                            const contour = contours.get(i);
                            const length = cv.arcLength(contour, true);
                            if (length > maxLength) {
                                maxLength = length;
                                maxContour = contour;
                            }
                        }

                        if (maxLength > 200) {
                            result.push('chuột trái');
                        }
                    }
                    if (index === 1) {
                        let contours = new cv.MatVector();
                        let hierarchy = new cv.Mat();
                        cv.findContours(
                            src,
                            contours,
                            hierarchy,
                            cv.RETR_EXTERNAL,
                            cv.CHAIN_APPROX_SIMPLE
                        ); // Adjusted mode
                        let maxContour = null;
                        let maxLength = 0;
                        for (let i = 0; i < contours.size(); ++i) {
                            const contour = contours.get(i);
                            const length = cv.arcLength(contour, true);
                            if (length > maxLength) {
                                maxLength = length;
                                maxContour = contour;
                            }
                        }

                        if (maxLength > 200) {
                            result.push('chuột phải');
                        }
                    }
                    if (index === 2) {
                        let dst = new cv.Mat();
                        let mask = new cv.Mat();
                        let t = new cv.Mat();
                        cv.cvtColor(templ, t, cv.COLOR_BGR2GRAY);
                        cv.matchTemplate(edges2, t, dst, cv.TM_CCOEFF);
                        let res = cv.minMaxLoc(dst, mask);
                        let maxPoint = res.maxLoc;

                        let point = new cv.Point(
                            maxPoint.x + templ.cols,
                            maxPoint.y + templ.rows
                        );
                        const A = { x: 95, y: 20 };
                        const B = { x: 115, y: 87 };
                        const C = { x: maxPoint.x, y: maxPoint.y };
                        const D = { x: point.x, y: point.y };
                        const a = Math.abs(A.x) <= Math.abs(C.x);
                        const b = Math.abs(A.y) >= Math.abs(C.y);
                        const c = Math.abs(B.x) <= Math.abs(D.x);
                        const d = Math.abs(B.y) >= Math.abs(D.y);

                        console.log(a, b, c, d);

                        if (!a && !b && !c && !d) {
                            console.log('N');
                        } else {
                            result.push('Con lăn');
                        }
                    }
                    if (index === 3) {
                        const area = cv.countNonZero(src);
                        if (area > 100 && area < 300) result.push('Logo');
                    }
                } catch (error) {
                    console.error('Error extracting error:', error);
                }
            });
        }

        cv.imshow(cannyEdgeRef.current, edges);
    };

    return (
        <div className='p-10 border rounded-2xl mb-10 mx-10'>
            {image && (
                <div className='flex gap-10'>
                    <div className='image-card'>
                        <div style={{ margin: '10px' }}>The original image</div>
                        <img
                            alt='Original input'
                            src={image}
                            onLoad={(e) => {
                                processImage(e.target);
                            }}
                        />
                    </div>
                    <div className='image-card'>
                        <div style={{ margin: '10px' }}>↓Canny Edge Result</div>
                        <canvas ref={cannyEdgeRef} />
                    </div>
                    {isShow && (
                        <div className='image-card flex text-center'>
                            <span
                                style={{ margin: '10px' }}
                                className='text-xl font-extrabold'>
                                Result:
                            </span>
                            <ul>
                                {result.map((item, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className='text-xl font-extrabold text-black m-10'>
                                            {item}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HandleProsesing;
