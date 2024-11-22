import { useState, useEffect, ReactNode } from "react";

interface CustButtonProps{
    label: string;
    className: string;
    onClick: ()=>void;
    children?: ReactNode;
}

const CustButton:React.FC<CustButtonProps>=({label, className, onClick , children})=>{
    const [clicked,setClicked] = useState(false)
    const handleClick = ()=>{
        setClicked(true)
        setTimeout(()=>{
            setClicked(false)
        },500)
        onClick()
    }

    const buttonClassName = `${className} ${
        clicked ? 'transform scale-5 opacity-80 bg-gray-100 border-gray-600' : ''
      } transition-all duration-300 ease-out`;
    return(
        <button className={buttonClassName} onClick={()=>handleClick}>{children || label}</button>
    )
}

export default CustButton