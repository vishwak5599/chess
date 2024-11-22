import { useEffect, useState } from "react"
import { FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing, FaChessPawn } from "react-icons/fa"

type ChessPieceType = {
    col : string
}
const ChessPiece:React.FC<ChessPieceType> = ({col}) => {

    const [windowSize, setWindowSize] = useState(window.innerWidth)
    
    useEffect(()=>{
        const handleResize = () => setWindowSize(window.innerWidth)
        
        window.addEventListener('resize',handleResize)
        console.log(windowSize)
        return ()=> window.removeEventListener('resize',handleResize)
    },[window.innerWidth])

    const getSize = () =>{
        return windowSize<640 ? 22 : windowSize<768 ? 26 : windowSize<1024 ? 30 : windowSize<1128 ? 34 : windowSize<1440 ? 36 : windowSize<1800 ? 40 : 42
    }

    return(
        <div>
            {col=="R" ? <FaChessRook color="white" size={getSize()}/> :
            col=="r" ? <FaChessRook color="black" size={getSize()}/> :
            col=="N" ? <FaChessKnight color="white" size={getSize()}/> :
            col=="n" ? <FaChessKnight color="black" size={getSize()}/> :
            col=="B" ? <FaChessBishop color="white" size={getSize()}/> :
            col=="b" ? <FaChessBishop color="black" size={getSize()}/> :
            col=="Q" ? <FaChessQueen color="white" size={getSize()}/> :
            col=="q" ? <FaChessQueen color="black" size={getSize()}/> :
            col=="K" ? <FaChessKing color="white" size={getSize()}/> :
            col=="k" ? <FaChessKing color="black" size={getSize()}/> :
            col=="P" ? <FaChessPawn color="white" size={getSize()}/> :
            col=="p" ? <FaChessPawn color="black" size={getSize()}/> :
            col}
        </div>
    )
}

export default ChessPiece