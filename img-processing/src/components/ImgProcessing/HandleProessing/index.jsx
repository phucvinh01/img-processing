import { useRef, useState } from 'react';
import cv, { Mat } from '@techstark/opencv-js';
import ColorThief from 'colorthief'
import checkboxImg from '../../../assets/icons8-checkbox-24.png'
import errors from '../../../assets/icons8-x-48.png'

function ColorDisplay({ rgb }) {
    const colorStyle = {
        backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
    };

    return (
        <div className='rounded-full w-[50px] flex justify-center items-center flex-col'>
            <p>Color</p>
            <div style={colorStyle} className='w-[30px] h-[30px] border rounded-full'></div>
        </div>
    );
}

const HandleProsesing = (props) => {
    const { image, template, isShow } = props;

    let [result, setResult] = useState([]);


    const [rbg, setRbg] = useState('')

    const imagesWithContour = [];
    const cannyEdgeRef = useRef();
    const cannyEdgeRef1 = useRef();
    const cannyEdgeRef2 = useRef();
    const cannyEdgeRef3 = useRef();
    const cannyEdgeRef4 = useRef();

    const low = 100
    const upper = 200


    const regions = [
        { x: 40, y: 0, width: 40, height: 160 },
        { x: 150, y: 0, width: 40, height: 160 },
        { x: 100, y: 30, width: 30, height: 67 },
        { x: 95, y: 155, width: 40, height: 60 },
    ];

    let templ = cv.imread(template);

    const processImage = (image) => {
        // read image and resize img 230x250
        const imgSize = cv.imread(image);


        const desiredSize = new cv.Size(230, 250); // Kích thước mong muốn
        const imgtemp = new cv.Mat();
        cv.resize(imgSize, imgtemp, desiredSize, 0, 0, cv.INTER_LINEAR);

        //Chuyển đổi ảnh xám,
        const imgGray = new cv.Mat();
        cv.cvtColor(imgtemp, imgGray, cv.COLOR_BGR2GRAY, 0);
        // Xử lý canny trên hình ảnh đã làm mờ
        const edges = new cv.Mat();
        cv.Canny(imgGray, edges, low, upper, 3, false);
        // Vẽ các khung cố định xác định thành phần vật lên ảnh canny
        cv.imshow(cannyEdgeRef.current, edges);

        regions.map((region) => {
            cv.rectangle(
                edges,
                new cv.Point(region.x, region.y),
                new cv.Point(region.x + region.width, region.y + region.height),
                [255, 0, 0, 255],
                2
            );
        });




        //Cắt các thành phần vật trong vùng xác định
        Promise.all(
            regions.map((region) => {
                const rect = new cv.Rect(
                    region.x,
                    region.y,
                    region.width,
                    region.height
                );
                try {
                    const roi = edges.roi(rect);
                    //imagesWithOutContour.push(roi)
                    const e = new cv.Mat();
                    cv.Canny(roi, e, 100, 100);
                    imagesWithContour.push(e);
                    //e.delete()
                } catch (error) {
                    console.error('Error extracting ROI:', error);
                }
            })
        );



        //Kiểm tra cách vùng cắt
        if (imagesWithContour.length === 4) {

            cv.imshow(cannyEdgeRef1.current, imagesWithContour[0])
            cv.imshow(cannyEdgeRef2.current, imagesWithContour[1])
            cv.imshow(cannyEdgeRef3.current, imagesWithContour[2])
            cv.imshow(cannyEdgeRef4.current, imagesWithContour[3])
            imagesWithContour.map(async (src, index) => {
                try {
                    // Vùng chuột trái
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
                        console.log("check length - right", maxLength);

                        if (maxLength > 200) {
                            result.push('mouse-right');
                        }

                    }
                    // Vùng chuột phải
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
                        console.log("check length - left", maxLength);
                        if (maxLength > 200) {
                            result.push('mouse-left');
                        }
                    }

                    // Vùng con lăn
                    if (index === 2) {
                        let dst = new cv.Mat();
                        let mask = new cv.Mat();
                        let t = new cv.Mat();
                        cv.cvtColor(templ, t, cv.COLOR_BGR2GRAY);
                        cv.matchTemplate(edges, t, dst, cv.TM_CCOEFF);
                        let res = cv.minMaxLoc(dst, mask);
                        let maxPoint = res.maxLoc;
                        //{ x: 100, y: 30, width: 30, height: 67 },
                        let point = new cv.Point(
                            maxPoint.x + templ.cols,
                            maxPoint.y + templ.rows
                        );
                        const A = { x: 100, y: 2300 };
                        const B = { x: 130, y: 97 };
                        const C = { x: maxPoint.x, y: maxPoint.y };
                        const D = { x: point.x, y: point.y };
                        const a = Math.abs(A.x) <= Math.abs(C.x);
                        const b = Math.abs(A.y) >= Math.abs(C.y);
                        const c = Math.abs(B.x) <= Math.abs(D.x);
                        const d = Math.abs(B.y) >= Math.abs(D.y);


                        console.log("check point", C, D, A, B);

                        if (!a && !b && !c && !d) {
                            console.log("");
                        }
                        else {
                            result.push('scroll-wheel');
                        }
                    }

                    //Vungf logo
                    if (index === 3) {
                        const area = cv.countNonZero(src);
                        console.log("check area", area);
                        if (area > 160 && area < 300) result.push('logo');
                    }
                } catch (error) {
                    console.error('Error extracting error:', error);
                }
            });
        }



        //Xóa bộ nhớ đệm

        // edges.delete()
        // imgGray.delete()
        // imgtemp.delete()
        result = null
    };

    const handleColor = (e) => {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(e.target);
        if (dominantColor) {
            setRbg(dominantColor)
        }
    }

    return (
        <div className='p-10 border rounded-2xl mb-10 mx-10'>

            {image && (
                <>
                    <div className='flex flex-col justify-center items-center w-1/5'>
                        <div>The original image</div>
                        <img
                            className=''
                            id='img'
                            alt='Original input'
                            src={image}
                            onLoad={(e) => {
                                processImage(e.target);
                                handleColor(e);
                            }}
                        />
                    </div>
                    <div className='flex gap-10 items-center '>
                        <div className='flex flex-col justify-center items-center w-1/5'>
                            <div>Canny Edge Result</div>
                            <canvas ref={cannyEdgeRef} />
                        </div>
                        <div className='flex gap-2 justify-center items-center aspect-auto'>
                            <div className='flex flex-col'>
                                <p>Mouse-right capture</p>
                                <canvas ref={cannyEdgeRef1} className='h-[150px]' />
                            </div>
                            <div className='flex flex-col'>
                                <p>Mouse-left capture</p>
                                <canvas ref={cannyEdgeRef2} className='h-[150px]' />

                            </div>
                            <div className='flex flex-col'>
                                <p>Croll wheel capture</p>
                                <canvas ref={cannyEdgeRef3} className='h-[150px]' />
                            </div>
                            <div className='flex flex-col'>
                                <p>Mouse-logo capture</p>
                                <canvas ref={cannyEdgeRef4} className='h-[150px]' />
                            </div>


                        </div>
                        <div className='w-[30px]'>
                            <ColorDisplay rgb={rbg} />
                        </div>

                        <div className='flex flex-col justify-center items-center flex text-end w-1/5'>
                            <ul className='flex flex-col gap-2'>
                                <li
                                    className='text-xl font-extrabold'>
                                    Result:
                                </li>
                                {/* {result.map((item, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className='text-xl font-extrabold text-black '>
                                            {item}
                                        </li>
                                    );
                                })} */}
                                <li className='flex items-center w-100 justify-between'>
                                    <label>Mouse-right</label>
                                    <div className='w-[30px] h-[30px] border'>
                                        {
                                            result.includes('mouse-right') ? <img src={checkboxImg} alt='checkbox' className='w-full object-contain' />
                                                : <img src={errors} className='w-full object-contain' alt='checkbox' />
                                        }
                                    </div>
                                </li>
                                <li className='flex  items-start w-100 justify-between'>
                                    <label>Mouse-left</label>
                                    <div className='w-[30px] h-[30px] border'>
                                        {
                                            result.includes('mouse-left') ? <img src={checkboxImg} alt='checkbox' className='w-full object-contain' />
                                                : <img src={errors} className='w-full object-contain' alt='checkbox' />
                                        }
                                    </div>
                                </li>
                                <li className='flex items-center w-100 justify-between'>
                                    <label>Scroll wheel</label>
                                    <div className='w-[30px] h-[30px] border'>
                                        {
                                            result.includes('scroll-wheel') ? <img src={checkboxImg} alt='checkbox' className='w-full object-contain' />
                                                : <img src={errors} className='w-full object-contain' alt='checkbox' />
                                        }
                                    </div>
                                </li>
                                <li className='flex  items-center w-100 justify-between'>
                                    <label>Logo</label>
                                    <div className='w-[30px] h-[30px] border'>
                                        {
                                            result.includes('logo') ? <img src={checkboxImg} alt='checkbox' className='w-full object-contain' />
                                                : <img src={errors} className='w-full object-contain' alt='checkbox' />
                                        }
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HandleProsesing;
