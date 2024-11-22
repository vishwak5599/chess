"use client"
import ChessPiece from "@/Components/ChessPiece"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type selectedPieceType = {
    piece : string | null
    row : number | null
    col : number | null
}

type possibleMovesForPieceType = {
    row : number
    col : number
}

const GamePage=()=>{

    const searchParams = useSearchParams()
    const pieceColour = searchParams ? searchParams.get('pieceColour') : "1"
    const time = searchParams ? searchParams.get('time') : "30"
    const increment = searchParams ? searchParams.get('increment') : "0"
    const [isSelected, setIsSelected] = useState(false)
    const [selectedPiece, setSelectedPiece] = useState<selectedPieceType>({piece: null,row: null,col: null})
    const [possibleMovesForPiece, setPossibleMovesForPiece] = useState<possibleMovesForPieceType[]>([])
    const [board,setBoard] = useState(pieceColour==="1" ? [
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
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r']
      ]
    )
    const whitePieces = ["R","N","B","Q","K","P"]
    const blackPieces = ["r","n","b","q","k","p"]

    const handleSelectedPiece = (piece:string,i:number,j:number) => {
        if(isSelected && selectedPiece.piece===piece && selectedPiece.row===i && selectedPiece.col===j){
            setIsSelected(false)
            setSelectedPiece((prev)=>({
                ...prev,piece:null,row:null,col:null
            }))
        }
        else{
            setIsSelected(true)
            setSelectedPiece((prev)=>({
                ...prev,piece:piece,row:i,col:j
            }))
        }
    }

    useEffect(()=>{
        if(isSelected){
            setPossibleMovesForPiece([])
            if(pieceColour==="1"){
                //WHITE KNIGHT
                if(selectedPiece.piece==="N" && selectedPiece.row!==null && selectedPiece.col!==null){
                    //BIG L
                    if(selectedPiece.row-2>=0 && selectedPiece.col+1<8 && !whitePieces.includes(board[selectedPiece.row-2][selectedPiece.col+1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 2, col: selectedPiece.col! + 1},
                        ]);
                    }
                    if(selectedPiece.row-2>=0 && selectedPiece.col-1>=0 && !whitePieces.includes(board[selectedPiece.row-2][selectedPiece.col-1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 2, col: selectedPiece.col! - 1},
                        ]);
                    }
                    if(selectedPiece.row+2<8 && selectedPiece.col+1<8 && !whitePieces.includes(board[selectedPiece.row+2][selectedPiece.col+1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 2, col: selectedPiece.col! + 1},
                        ]);
                    }
                    if(selectedPiece.row+2<8 && selectedPiece.col-1>=0 && !whitePieces.includes(board[selectedPiece.row+2][selectedPiece.col-1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 2, col: selectedPiece.col! - 1},
                        ]);
                    }
                    //SMALL L
                    if(selectedPiece.row-1>=0 && selectedPiece.col+2<8 && !whitePieces.includes(board[selectedPiece.row-1][selectedPiece.col+2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 1, col: selectedPiece.col! + 2},
                        ]);
                    }
                    if(selectedPiece.row-1>=0 && selectedPiece.col-2>=0 && !whitePieces.includes(board[selectedPiece.row-1][selectedPiece.col-2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 1, col: selectedPiece.col! - 2},
                        ]);
                    }
                    if(selectedPiece.row+1<8 && selectedPiece.col+2<8 && !whitePieces.includes(board[selectedPiece.row+1][selectedPiece.col+2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 1, col: selectedPiece.col! + 2},
                        ]);
                    }
                    if(selectedPiece.row+1<8 && selectedPiece.col-2>=0 && !whitePieces.includes(board[selectedPiece.row+1][selectedPiece.col-2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 1, col: selectedPiece.col! - 2},
                        ]);
                    }

                }
                //BLACK KNIGHT
                if(selectedPiece.piece==="n" && selectedPiece.row!==null && selectedPiece.col!==null){
                    //BIG L
                    if(selectedPiece.row+2<8 && selectedPiece.col+1<8 && !blackPieces.includes(board[selectedPiece.row+2][selectedPiece.col+1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 2, col: selectedPiece.col! + 1},
                        ]);
                    }
                    if(selectedPiece.row+2<8 && selectedPiece.col-1>=0 && !blackPieces.includes(board[selectedPiece.row+2][selectedPiece.col-1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 2, col: selectedPiece.col! - 1},
                        ]);
                    }
                    if(selectedPiece.row-2>=0 && selectedPiece.col+1<8 && !blackPieces.includes(board[selectedPiece.row-2][selectedPiece.col+1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 2, col: selectedPiece.col! + 1},
                        ]);
                    }
                    if(selectedPiece.row-2>=0 && selectedPiece.col-1>=0 && !blackPieces.includes(board[selectedPiece.row-2][selectedPiece.col-1])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 2, col: selectedPiece.col! - 1},
                        ]);
                    }
                    //SMALL L
                    if(selectedPiece.row+1<8 && selectedPiece.col+2<8 && !blackPieces.includes(board[selectedPiece.row+1][selectedPiece.col+2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 1, col: selectedPiece.col! + 2},
                        ]);
                    }
                    if(selectedPiece.row+1<8 && selectedPiece.col-2>=0 && !blackPieces.includes(board[selectedPiece.row+1][selectedPiece.col-2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! + 1, col: selectedPiece.col! - 2},
                        ]);
                    }
                    if(selectedPiece.row-1>=0 && selectedPiece.col+2<8 && !blackPieces.includes(board[selectedPiece.row-1][selectedPiece.col+2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 1, col: selectedPiece.col! + 2},
                        ]);
                    }
                    if(selectedPiece.row-1>=0 && selectedPiece.col-2>=0 && !blackPieces.includes(board[selectedPiece.row-1][selectedPiece.col-2])){
                        setPossibleMovesForPiece((prev)=>[ 
                            ...prev,{row: selectedPiece.row! - 1, col: selectedPiece.col! - 2},
                        ]);
                    }
                }
            }
        }
    },[isSelected,selectedPiece])



    return(
        <main className="h-full w-full">
            <div className="flex flex-col justify-center items-center p-5">
                <div className="" style={{ border: "25px solid transparent",borderImage: "url('/images/woodenbg.jpg') 35 round"}}>
                    {board.map((row,i)=>(
                        <div key={i} className="flex justify-center">
                            {row.map((col,j)=>(
                                <div key={i+""+j} className={`${(isSelected && selectedPiece.row===i && selectedPiece.col===j) ? "bg-blue-800" : (isSelected && possibleMovesForPiece.some(move => move.row===i && move.col===j)) ? "bg-blue-800" : (i+j)%2==0 ? "bg-gray-400" : "bg-blue-500"} flex h-8 w-8 pt-1.5 md:pt-2 lg:pt-2.5 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 xxl:h-16 xxl:w-16 justify-center`}
                                    onClick={()=>col!==" " ? handleSelectedPiece(col,i,j) : ""}
                                >
                                    <ChessPiece col={col} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
export default GamePage