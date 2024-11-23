"use client"
import ChessPiece from "@/Components/ChessPiece"
import { useSearchParams } from "next/navigation"
import { it } from "node:test";
import { useEffect, useState } from "react"
import { FaStopwatch } from "react-icons/fa6";

type selectedPieceType = {
    piece : string | null
    row : number | null
    col : number | null
}

type possibleMovesForPieceType = {
    row : number
    col : number
}

type piecePositionType = {
    piece : string
    row : number
    col : number
}

type allPossibleMovesType = {
    piece : string
    posi:{row:number,col:number}
    moves:{row:number,col:number}[]
}

const GamePage=()=>{

    const searchParams = useSearchParams()
    const pieceColour = searchParams ? Number(searchParams.get('pieceColour')) : 1
    const time = searchParams ? Number(searchParams.get('time'))*60 : 30*60
    const increment = searchParams ? Number(searchParams.get('increment')) : 0
    const [moves,setMoves] = useState(pieceColour===1 ? 0 : 1)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceType>({piece: null,row: null,col: null})
    const [possibleMovesForSelectedPiece, setPossibleMovesForSelectedPiece] = useState<possibleMovesForPieceType[]>([])
    const [allPossibleMoves, setAllPossibleMoves] = useState<allPossibleMovesType[]>([])
    const [curWhite,setCurWhite] = useState<piecePositionType[]>([])
    const [curBlack,setCurBlack] = useState<piecePositionType[]>([])
    const [board,setBoard] = useState(pieceColour===1 ? [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
      ] :
      [
        ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r']
      ]
    )
    const whitePieces = ["R","N","B","Q","K","P"]
    const blackPieces = ["r","n","b","q","k","p"]

    const updateSelectedPiecePosition = (selPiece:string,selRow:number,selCol:number,newRow:number,newCol:number) => {
        console.log("hi")
        setBoard((prevBoard)=>{
            const newBoard = [...prevBoard]
            newBoard[selRow] = [...prevBoard[selRow]]
            newBoard[newRow] = [...prevBoard[newRow]]
            newBoard[selRow][selCol] = " "
            newBoard[newRow][newCol] = selPiece
            return newBoard
        })
    }

    const handleSelectedPiece = (piece:string,i:number,j:number) => {
        //1. select a piece is any other piece is not selected
        if(!isSelected){
            if((pieceColour===1 && moves%2===0 && whitePieces.includes(board[i][j])) || (pieceColour===1 && moves%2!==0 && blackPieces.includes(board[i][j])) || (pieceColour===0 && moves%2!==0 && whitePieces.includes(board[i][j])) || (pieceColour===0 && moves%2===0 && blackPieces.includes(board[i][j]))){
                setIsSelected(true)
                setSelectedPiece({piece:piece,row:i,col:j})
                setPossibleMovesForSelectedPiece([])
            }
        }
        //2. deselect if same piece is selected again
        else if(isSelected && selectedPiece.piece===piece && selectedPiece.row===i && selectedPiece.col===j){
            setIsSelected(false)
            setSelectedPiece({piece:null,row:null,col:null})
            setPossibleMovesForSelectedPiece([])
        }
        //3. select if another same colour piece is selected
        else if(isSelected && ((pieceColour===1 && moves%2===0 && whitePieces.includes(board[i][j])) || (pieceColour===1 && moves%2!==0 && blackPieces.includes(board[i][j])) || (pieceColour===0 && moves%2!==0 && whitePieces.includes(board[i][j])) || (pieceColour===0 && moves%2===0 && blackPieces.includes(board[i][j])))){
            setPossibleMovesForSelectedPiece([])
            setIsSelected(true)
            setSelectedPiece({piece:piece,row:i,col:j})
        }
        //4. update
        else if (isSelected && selectedPiece.piece!==null && selectedPiece.row!==null && selectedPiece.col!==null && possibleMovesForSelectedPiece.some((m)=>m.row===i && m.col===j)) {
            updateSelectedPiecePosition(selectedPiece.piece, selectedPiece.row, selectedPiece.col, i, j)
            setIsSelected(false)
            setSelectedPiece({piece:null,row:null,col:null})
            setPossibleMovesForSelectedPiece([])
            setMoves((prev)=>prev+1)
        }
    }

    useEffect(()=>{
        if(isSelected){
            const possibleMovesForPiece = allPossibleMoves.find((item)=>(item.piece===selectedPiece.piece && item.posi.row===selectedPiece.row && item.posi.col===selectedPiece.col))
            if(possibleMovesForPiece) setPossibleMovesForSelectedPiece(possibleMovesForPiece?.moves)
        }
        else{
            setPossibleMovesForSelectedPiece([])
        }
    },[isSelected,selectedPiece])

    //ALL WHITE KNIGHT MOVES
    const findMovesForN = (row:number, col:number) => {
        const movesArray:{row:number,col:number}[] = []
        //BIG L
        if(row-2>=0 && col+1<8 && !whitePieces.includes(board[row-2][col+1])) movesArray.push({row:row-2,col:col+1})
        if(row-2>=0 && col-1>=0 && !whitePieces.includes(board[row-2][col-1])) movesArray.push({row:row-2,col:col-1})
        if(row+2<8 && col+1<8 && !whitePieces.includes(board[row+2][col+1])) movesArray.push({row:row+2,col:col+1})
        if(row+2<8 && col-1>=0 && !whitePieces.includes(board[row+2][col-1])) movesArray.push({row:row+2,col:col-1})
        //SMALL L
        if(row-1>=0 && col+2<8 && !whitePieces.includes(board[row-1][col+2])) movesArray.push({row:row-1,col:col+2})
        if(row-1>=0 && col-2>=0 && !whitePieces.includes(board[row-1][col-2])) movesArray.push({row:row-1,col:col-2})
        if(row+1<8 && col+2<8 && !whitePieces.includes(board[row+1][col+2])) movesArray.push({row:row+1,col:col+2})
        if(row+1<8 && col-2>=0 && !whitePieces.includes(board[row+1][col-2])) movesArray.push({row:row+1,col:col-2})
        setAllPossibleMoves((prev) => {return [...prev,{piece:"N",posi:{row:row,col:col},moves:movesArray}]})
    }

    //ALL BLACK KNIGHT MOVES
    const findMovesForn = (row:number, col:number) => {
        const movesArray:{row:number,col:number}[] = []
        //BIG L
        if(row+2<8 && col+1<8 && !blackPieces.includes(board[row+2][col+1])) movesArray.push({row:row+2,col:col+1})        
        if(row+2<8 && col-1>=0 && !blackPieces.includes(board[row+2][col-1])) movesArray.push({row:row+2,col:col-1})
        if(row-2>=0 && col+1<8 && !blackPieces.includes(board[row-2][col+1])) movesArray.push({row:row-2,col:col+1})
        if(row-2>=0 && col-1>=0 && !blackPieces.includes(board[row-2][col-1])) movesArray.push({row:row-2,col:col-1})
        //SMALL L
        if(row+1<8 && col+2<8 && !blackPieces.includes(board[row+1][col+2])) movesArray.push({row:row+1,col:col+2})
        if(row+1<8 && col-2>=0 && !blackPieces.includes(board[row+1][col-2])) movesArray.push({row:row+1,col:col-2})
        if(row-1>=0 && col+2<8 && !blackPieces.includes(board[row-1][col+2])) movesArray.push({row:row-1,col:col+2})
        if(row-1>=0 && col-2>=0 && !blackPieces.includes(board[row-1][col-2])) movesArray.push({row:row-1,col:col-2})
        setAllPossibleMoves((prev) => {return [...prev,{piece:"n",posi:{row:row,col:col},moves:movesArray}]})
    }

    const handleAllWhitePieces = () => {
        setCurWhite([])
        const newCurWhite:{piece:string,row:number,col:number}[] = []
        board.forEach((x,i)=>{
            x.forEach((y,j)=>{
                if(whitePieces.includes(y)){
                    newCurWhite.push({piece:y,row:i,col:j})
                }
            })
        })
        setCurWhite(newCurWhite)
    }

    const handleAllBlackPieces = () => {
        setCurBlack([])
        const newCurBlack:{piece:string,row:number,col:number}[] = []
        board.forEach((x,i)=>{
            x.forEach((y,j)=>{
                if(blackPieces.includes(y)){
                    newCurBlack.push({piece:y,row:i,col:j})
                }
            })
        })
        setCurBlack(newCurBlack)
    }

    useEffect(()=>{
        curWhite.forEach((key)=>{
            if(key.piece==="N"){
                findMovesForN(key.row,key.col)
            }
        })
    },[curWhite])

    useEffect(()=>{
        curBlack.forEach((key)=>{
            if(key.piece==="n"){
                findMovesForn(key.row,key.col)
            }
        })
    },[curBlack])

    useEffect(()=>{
        setAllPossibleMoves([])
        if(pieceColour===1){
            if(moves%2===0){
                //ALL WHITE MOVES
                handleAllWhitePieces()
            }
            else{
                //ALL BLACK MOVES
                handleAllBlackPieces()
            }
        }
        else{
            if(moves%2!==0){
                //ALL WHITE MOVES
                handleAllWhitePieces()
            }
            else{
                //ALL BLACK MOVES
                handleAllBlackPieces()
            }
        }
    },[pieceColour,moves,board])


    return(
        <main className="h-full w-full">
            <div className="flex flex-col justify-center items-center p-2">
                <div key="sw-1" className={`${pieceColour===1 ? `${moves%2!==0 ? "bg-black" : "bg-gray-600"} text-white` : "bg-white text-black"} flex justify-center items-center ml-[40%] md:ml-[25%] mb-1 border-2 border-blue-500 font-bold font-technology text-base md:text-xl p-1 rounded-md gap-2 transform scale-y-[-1] scale-x-[-1]`}>
                    <div className="">{(Math.floor(time/60)===0) ? `00 : 00:${time}` : 
                     (Math.floor(time/3600)===0) ? `00 : ${time/60<10 ? `0${time/60}` :time/60} : ${time%60<10 ? `0${time%60}` : time%60}`
                     : `0${Math.floor(time/3600)} : ${(Math.floor(time/60)%60)<10 ? `0${(Math.floor(time/60)%60)}` : (Math.floor(time/60)%60)} : ${time%60<10 ? `0${time%60}` : time%60}`}
                    </div>
                    <div className="w-5">{moves%2!==0 ? <FaStopwatch color={`${pieceColour===1 ? "white" : "black"}`} /> : ""}</div>
                </div>
                <div className="" style={{ border: "10px solid transparent",borderImage: "url('/images/woodenbg.jpg') 15 round"}}>
                    {board.map((row,i)=>(
                        <div key={i} className="flex justify-center">
                            {row.map((col,j)=>(
                                <div key={i+""+j} className={`${(isSelected && selectedPiece.row===i && selectedPiece.col===j) ? "bg-blue-800" : (isSelected && possibleMovesForSelectedPiece.some(move => move.row===i && move.col===j)) ? "bg-blue-800" : (i+j)%2==0 ? "bg-gray-400" : "bg-blue-500"} flex h-9 w-9 pt-1.5 md:pt-2 lg:pt-2.5 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 xxl:h-16 xxl:w-16 justify-center`}
                                    onClick={()=>handleSelectedPiece(col,i,j)}
                                >
                                    <ChessPiece col={col} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div key="sw-2" className={`${pieceColour===1 ? `${moves%2===0 ? "bg-white" : "bg-slate-500"} text-black` : "bg-black text-white"} flex justify-center items-center ml-[40%] md:ml-[25%] mt-1 border-2 border-blue-500 font-bold font-technology text-base md:text-xl p-1 rounded-md gap-2`}>
                    <div className="w-5">{moves%2===0 ? <FaStopwatch color={`${pieceColour===1 ? "black" : "white"}`} /> : ""}</div>
                    <div className="">{(Math.floor(time/60)===0) ? `00 : 00:${time}` : 
                     (Math.floor(time/3600)===0) ? `00 : ${time/60<10 ? `0${time/60}` :time/60} : ${time%60<10 ? `0${time%60}` : time%60}`
                     : `0${Math.floor(time/3600)} : ${(Math.floor(time/60)%60)<10 ? `0${(Math.floor(time/60)%60)}` : (Math.floor(time/60)%60)} : ${time%60<10 ? `0${time%60}` : time%60}`}</div>
                </div>
            </div>
        </main>
    )
}
export default GamePage