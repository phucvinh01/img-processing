import React, { useState, useEffect, useRef } from "react";
import ImageUploader from "./components/LoadImg";
import HandleProsesing from "./components/HandleProessing";
import './App.css'
import second from './assets/template.png'

function App() {

  const [folder, setFolder] = useState([])
  const [template, setTemplate] = useState(null);
  const [template2, setTemplate2] = useState(null);
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    // Đọc mẫu
    const img = new Image();
    img.src = second;
    img.onload = (e) => {
      setTemplate(e.target);
      setTemplate2(img.src)
    };
  }, []);

  return (
    <div>
      <ImageUploader setFolder={setFolder} />
      <img src={template} alt="Template" className="hidden" />
      <div className="flex justify-center items-center">
        <button onClick={() => setIsShow(!isShow)} className="px-5 py-3 capitalize bg-slate-300 m-10 rounded-lg hover:bg-slate-100 hover:text-cyan-700 hover:font-extrabold hover:scale-105 transition-all">Show Result</button>
      </div>
      <ul>
        {
          folder.map((item) => {
            return (
              <>
                <HandleProsesing image={item} template={template} isShow={isShow} />
              </>
            )
          })
        }
      </ul>
    </div>
  );
}

export default App