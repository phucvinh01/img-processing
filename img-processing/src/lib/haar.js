import nev1 from '../assets/nev/1.jpg'
import nev2 from '../assets/nev/2.jpg'
import nev3 from '../assets/nev/3.jpg'
import nev4 from '../assets/nev/4.jpg'
import nev5 from '../assets/nev/5.jpg'
import nev6 from '../assets/nev/6.jpg'
import nev7 from '../assets/nev/7.jpg'

import pos1 from '../assets/positive/1.jpg'
import pos2 from '../assets/positive/2.jpg'
import pos3 from '../assets/positive/3.jpg'
import pos4 from '../assets/positive/4.jpg'
import pos5 from '../assets/positive/5.jpg'
import pos6 from '../assets/positive/6.jpg'
import pos7 from '../assets/positive/7.jpg'
import pos8 from '../assets/positive/8.jpg'
import pos9 from '../assets/positive/9.jpg'
import pos10 from '../assets/positive/10.jpg'
import pos11 from '../assets/positive/11.jpg'
import pos12 from '../assets/positive/12.jpg'

import cv from "@techstark/opencv-js";




export const trainCascade = async () => {
    const positiveImages = [nev1, nev2, nev3, nev4, nev5, nev6, nev7]; // Mảng chứa các đường dẫn đến ảnh dương tính
    const negativeImages = [pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos9, pos10, pos11, pos12]; // Mảng chứa các đường dẫn đến ảnh âm tính

    // Đọc ảnh dương tính và âm tính
    const promises = positiveImages.concat(negativeImages).map((imagePath) => {
        return new Promise((resolve, reject) => {
            const imgElement = new Image();
            imgElement.crossOrigin = 'anonymous';
            imgElement.onload = () => {
                const imgMat = cv.imread(imgElement);
                cv.cvtColor(imgMat, imgMat, cv.COLOR_RGBA2GRAY);
                resolve(imgMat);
            };
            imgElement.onerror = (error) => {
                reject(error);
            };
            imgElement.src = imagePath;
        });
    });

    try {
        const [positiveMats, negativeMats] = await Promise.all(promises);

        // Tạo tệp tin XML định dạng thông tin huấn luyện
        const trainData = cv.TrainData();
        trainData.setTrainTest(true, 10); // Chia dữ liệu thành tập huấn luyện và tập kiểm tra (10% cho tập kiểm tra)
        trainData.setImages(positiveMats, 1, negativeMats);
        trainData.setParams({
            boostType: cv.BOOST_REAL,
            weakCount: 100,
            maxDepth: 5,
            minHitRate: 0.995,
            maxFalseAlarmRate: 0.5,
        });

        // Huấn luyện cascade và lưu vào file XML
        cv.CascadeClassifier.train(trainData, 'cascade.xml');

        positiveMats.forEach((mat) => mat.delete());
        negativeMats.forEach((mat) => mat.delete());
    } catch (error) {
        console.error('Error training cascade:', error);
    }
};
