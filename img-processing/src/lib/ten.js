import * as tf from "@tensorflow/tfjs";

const regions = [
    {
        name: "left-click",
        position: [0, 0, 100, 100],
    },
    {
        name: "right-click",
        position: [100, 0, 200, 100],
    },
    {
        name: "scroll",
        position: [200, 0, 300, 100],
    },
    {
        name: "logo",
        position: [300, 0, 400, 100],
    },
];


const frame = tf.concat([image, regions], axis = 1);

const scrollRegion = frame[regions["scroll"]["position"][0], regions["scroll"]["position"][2]];

if (tf.reduce_any(scrollRegion)) {
    console.log("Vùng con lăn hợp lệ");
} else {
    console.log("Vùng con lăn không hợp lệ");
}