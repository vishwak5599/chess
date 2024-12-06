"use client"
import ChessPiece from "@/Components/ChessPiece"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { FaStopwatch } from "react-icons/fa6"
import { MdSkipPrevious } from "react-icons/md"

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

type pawnToLastSquarePosiType = {
    piece : string | null
    selRow : number | null
    selCol : number | null
    newRow : number | null
    newCol : number | null
}

type allPossibleMovesType = {
    piece : string
    posi:{row:number,col:number}
    moves:{row:number,col:number}[]
    protected:{row:number,col:number}[]
}

type allTempPossibleMovesType = {
    piece : string
    posi:{row:number,col:number}
    moves:{row:number,col:number}[]
}

type moveType = {
    piece : string
    fromRow : number
    fromCol : number
    toRow : number
    toCol : number
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
    const [allPossibleMovesForWhite, setAllPossibleMovesForWhite] = useState<allPossibleMovesType[]>([])
    const [allPossibleMovesForBlack, setAllPossibleMovesForBlack] = useState<allPossibleMovesType[]>([])
    const [curWhite,setCurWhite] = useState<piecePositionType[]>([])
    const [curBlack,setCurBlack] = useState<piecePositionType[]>([])
    const [topPlayerChoosePrev, setTopPlayerChoosePrev] = useState(false)
    const [botPlayerChoosePrev, setBotPlayerChoosePrev] = useState(false)
    const [pawnToLastSquarePosi, setPawnToLastSquarePosi] = useState<pawnToLastSquarePosiType>({piece:null,selRow:null,selCol:null,newRow:null,newCol:null})
    const [whiteKingCastlePossible,setWhiteKingCastlePossible] = useState(true)
    const [blackKingCastlePossible,setBlackKingCastlePossible] = useState(true)
    const [whiteRookCastlePossible,setWhiteRookCastlePossible] = useState({left:true,right:true})
    const [blackRookCastlePossible,setBlackRookCastlePossible] = useState({left:true,right:true})
    const [allMoves, setAllMoves] = useState<moveType[]>([])
    const [allTempPossibleMovesForWhite, setAllTempPossibleMovesForWhite] = useState<allTempPossibleMovesType[]>([])
    const [allTempPossibleMovesForBlack, setAllTempPossibleMovesForBlack] = useState<allTempPossibleMovesType[]>([])

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
    const [previousBoardPosi, setPreviousBoardPosi] = useState<[string[][],string[][]]>([[],board])
    const whitePieces = ["R","N","B","Q","K","P"]
    const blackPieces = ["r","n","b","q","k","p"]

    //function to find if White King is in threat
    const findThreatToWhiteKing = (forRealBoard: boolean, custBoard:string[][]) => {
        let row=0,col=0
        custBoard.forEach((r,i)=>{
            r.forEach((c,j)=>{
                if(c==="K"){
                    row=i
                    col=j
                }
            })
        })
        if(forRealBoard){
            return allPossibleMovesForBlack.some((piece)=>
                piece.moves.some((move)=>
                    move.row===row && move.col===col
                )
            )
        }
        else{
            return allTempPossibleMovesForBlack.some((piece)=>
                piece.moves.some((move)=>
                    move.row===row && move.col===col
                )
            )
        }
    }

    //function to find if Black King is in threat
    const findThreatToBlackKing = (forRealBoard:boolean, custBoard:string[][]) => {
        let row=0,col=0
        custBoard.forEach((r,i)=>{
            r.forEach((c,j)=>{
                if(c==="k"){
                    row=i
                    col=j
                }
            })
        })
        if(forRealBoard){
            return allPossibleMovesForWhite.some((piece)=>
                piece.moves.some((move)=>
                    move.row===row && move.col===col
                )
            )
        }
        else{
            return allTempPossibleMovesForWhite.some((piece)=>
                piece.moves.some((move)=>
                    move.row===row && move.col===col
                )
            )
        }
    }

    //function to check if there is any square attacked in between king and rook before castling
    const checkMiddleSquaresAttacked = (colour:string, side:string) => {
        if(pieceColour===1){
            if(colour==="white"){
                if(side==="left"){
                    if(board[7][1]===" " && board[7][2]===" " && board[7][3]===" "){
                        return allPossibleMovesForBlack.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 7 && move.col===1) || (move.row===7 && move.col===2) || (move.row===7 && move.col===3)
                            })
                        })
                    }
                    else return true
                }
                else{
                    if(board[7][5]===" " && board[7][6]===" "){
                        return allPossibleMovesForBlack.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 7 && move.col===5) || (move.row===7 && move.col===6)
                            })
                        })
                    }
                    else return true
                }
            }
            else{
                if(side==="left"){
                    if(board[0][1]===" " && board[0][2]===" " && board[0][3]===" "){
                        return allPossibleMovesForWhite.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 0 && move.col===1) || (move.row===0 && move.col===2) || (move.row===0 && move.col===3)
                            })
                        })
                    }
                    else return true
                }
                else{
                    if(board[0][5]===" " && board[0][6]===" "){
                        return allPossibleMovesForWhite.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 0 && move.col===5) || (move.row===0 && move.col===6)
                            })
                        })
                    }
                    else return true
                }
            }
        }
        else{
            if(colour==="white"){
                if(side==="left"){
                    if(board[0][1]===" " && board[0][2]===" " && board[0][3]===" "){
                        return allPossibleMovesForBlack.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 0 && move.col===1) || (move.row===0 && move.col===2) || (move.row===0 && move.col===3)
                            })
                        })
                    }
                    else return true
                }
                else{
                    if(board[0][5]===" " && board[0][6]===" "){
                        return allPossibleMovesForBlack.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 0 && move.col===5) || (move.row===0 && move.col===6)
                            })
                        })
                    }
                    else return true
                }
            }
            else{
                if(side==="left"){
                    if(board[7][1]===" " && board[7][2]===" " && board[7][3]===" "){
                        return allPossibleMovesForWhite.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 7 && move.col===1) || (move.row===7 && move.col===2) || (move.row===7 && move.col===3)
                            })
                        })
                    }
                    else return true
                }
                else{
                    if(board[7][5]===" " && board[7][6]===" "){
                        return allPossibleMovesForWhite.some((piece)=>{
                            piece.moves.some((move)=>{
                                (move.row=== 7 && move.col===5) || (move.row===7 && move.col===6)
                            })
                        })
                    }
                    else return true
                }
            }
        }
    }

    //function to go to previous move if player approves
    const handlePlayerChoosePrev = (ifApproves:boolean,whoChoose:string) => {
        if(ifApproves){
            if((pieceColour===1 && whoChoose==="w" && botPlayerChoosePrev && moves%2!==0) || (pieceColour===1 && whoChoose==="b" && topPlayerChoosePrev && moves%2===0) || (pieceColour===0 && whoChoose==="w" && topPlayerChoosePrev && moves%2===0) || (pieceColour===0 && whoChoose==="b" && botPlayerChoosePrev && moves%2!==0)){
                setBoard(previousBoardPosi[1])
                setPreviousBoardPosi([[],previousBoardPosi[0]])

                //check if the king is moved in previous move and it is the first time king moved set that the castling is possible if move is taken back
                if(allMoves[allMoves.length-1].piece==="K" && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="K")) setWhiteKingCastlePossible(true)
                if(allMoves[allMoves.length-1].piece==="k" && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="k")) setBlackKingCastlePossible(true)
                    
                //check if the rook is moved in previous move and it is the first time rook moved set that the castling is possible if move is taken back
                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===7 && move.fromCol===0)) setWhiteRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===7 && move.fromCol===7)) setWhiteRookCastlePossible((prev)=>({...prev,right:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===0 && move.fromCol===0)) setWhiteRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===0 && move.fromCol===7)) setWhiteRookCastlePossible((prev)=>({...prev,right:true}))

                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===7 && move.fromCol===0)) setBlackRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===7 && move.fromCol===7)) setBlackRookCastlePossible((prev)=>({...prev,right:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===0 && move.fromCol===0)) setBlackRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===0 && move.fromCol===7)) setBlackRookCastlePossible((prev)=>({...prev,right:true}))

                if(allMoves.length>0) setAllMoves((prev)=>prev.slice(0,allMoves.length-1))
                setMoves((prev)=>prev-1)
            }
            else{
                setBoard(previousBoardPosi[0])
                setPreviousBoardPosi([[],[]])

                //check if the king is moved in previous move and it is the first time king moved set that the castling is possible if move is taken back
                if(allMoves[allMoves.length-2].piece==="K" && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="K")) setWhiteKingCastlePossible(true)
                if(allMoves[allMoves.length-2].piece==="k" && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="k")) setBlackKingCastlePossible(true)
                
                if(allMoves[allMoves.length-1].piece==="K" && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="K")) setWhiteKingCastlePossible(true)
                if(allMoves[allMoves.length-1].piece==="k" && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="k")) setBlackKingCastlePossible(true)
                    
                //check if the rook is moved in previous move and it is the first time rook moved set that the castling is possible if move is taken back
                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===7 && move.fromCol===0)) setWhiteRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===7 && move.fromCol===7)) setWhiteRookCastlePossible((prev)=>({...prev,right:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===0 && move.fromCol===0)) setWhiteRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="R" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="R" && move.fromRow===0 && move.fromCol===7)) setWhiteRookCastlePossible((prev)=>({...prev,right:true}))

                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===7 && move.fromCol===0)) setBlackRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===1 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===0 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===7 && move.fromCol===7)) setBlackRookCastlePossible((prev)=>({...prev,right:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===0 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===0 && move.fromCol===0)) setBlackRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===0 && allMoves[allMoves.length-1].piece==="r" && allMoves[allMoves.length-1].fromRow===7 && allMoves[allMoves.length-1].fromCol===7 && !allMoves.slice(0,allMoves.length-1).some((move)=>move.piece==="r" && move.fromRow===0 && move.fromCol===7)) setBlackRookCastlePossible((prev)=>({...prev,right:true}))

                if(pieceColour===1 && allMoves[allMoves.length-2].piece==="R" && allMoves[allMoves.length-2].fromRow===7 && allMoves[allMoves.length-2].fromCol===0 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="R" && move.fromRow===7 && move.fromCol===0)) setWhiteRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===1 && allMoves[allMoves.length-2].piece==="R" && allMoves[allMoves.length-2].fromRow===7 && allMoves[allMoves.length-2].fromCol===7 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="R" && move.fromRow===7 && move.fromCol===7)) setWhiteRookCastlePossible((prev)=>({...prev,right:true}))
                if(pieceColour===0 && allMoves[allMoves.length-2].piece==="R" && allMoves[allMoves.length-2].fromRow===0 && allMoves[allMoves.length-2].fromCol===0 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="R" && move.fromRow===0 && move.fromCol===0)) setWhiteRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===0 && allMoves[allMoves.length-2].piece==="R" && allMoves[allMoves.length-2].fromRow===0 && allMoves[allMoves.length-2].fromCol===7 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="R" && move.fromRow===0 && move.fromCol===7)) setWhiteRookCastlePossible((prev)=>({...prev,right:true}))

                if(pieceColour===1 && allMoves[allMoves.length-2].piece==="r" && allMoves[allMoves.length-2].fromRow===0 && allMoves[allMoves.length-2].fromCol===0 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="r" && move.fromRow===7 && move.fromCol===0)) setBlackRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===1 && allMoves[allMoves.length-2].piece==="r" && allMoves[allMoves.length-2].fromRow===0 && allMoves[allMoves.length-2].fromCol===7 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="r" && move.fromRow===7 && move.fromCol===7)) setBlackRookCastlePossible((prev)=>({...prev,right:true}))
                if(pieceColour===0 && allMoves[allMoves.length-2].piece==="r" && allMoves[allMoves.length-2].fromRow===7 && allMoves[allMoves.length-2].fromCol===0 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="r" && move.fromRow===0 && move.fromCol===0)) setBlackRookCastlePossible((prev)=>({...prev,left:true}))
                if(pieceColour===0 && allMoves[allMoves.length-2].piece==="r" && allMoves[allMoves.length-2].fromRow===7 && allMoves[allMoves.length-2].fromCol===7 && !allMoves.slice(0,allMoves.length-2).some((move)=>move.piece==="r" && move.fromRow===0 && move.fromCol===7)) setBlackRookCastlePossible((prev)=>({...prev,right:true}))

                if(allMoves.length>1) setAllMoves((prev)=>prev.slice(0,allMoves.length-2))
                setMoves((prev)=>prev-2)
            }
        }
        setTopPlayerChoosePrev(false)
        setBotPlayerChoosePrev(false)
    }

    //function to remove enpassed pawns if enpassant move happens
    const removeEnpassedPawns = (piece:string,row:number,col:number) => {
        setBoard((prevBoard)=>{
            const newBoard = [...prevBoard]
            newBoard[row] = [...prevBoard[row]]
            newBoard[row][col] = " "
            return newBoard
        })
    }

    //function to handle if a piece is selected i.e QRNP/qrnp if a pawn reaches last square
    const handlePawnToLastSquare = (updatedPiece:string) => {
        if(pawnToLastSquarePosi.piece!==null && pawnToLastSquarePosi.selRow!==null && pawnToLastSquarePosi.selCol!==null && pawnToLastSquarePosi.newRow!==null && pawnToLastSquarePosi.newCol!==null) updateSelectedPiecePosition(updatedPiece,pawnToLastSquarePosi.selRow,pawnToLastSquarePosi.selCol,pawnToLastSquarePosi.newRow,pawnToLastSquarePosi.newCol)
        setPawnToLastSquarePosi({piece:null,selRow:null,selCol:null,newRow:null,newCol:null})
    }

    const handleRookPosiAfterCastling = (row:number, prevCol:number, newCol:number) => {
        setBoard((prevBoard)=>{
            const newBoard = [...prevBoard]
            newBoard[row] = [...prevBoard[row]]
            const piece = newBoard[row][prevCol]
            newBoard[row][prevCol] = " "
            newBoard[row][newCol] = piece
            return newBoard
        })
    }

    const updateSelectedPiecePosition = (selPiece:string,selRow:number,selCol:number,newRow:number,newCol:number) => {

        if(pieceColour===1){
            //remove the enpassant pawns if enpassant move happens
            if(selPiece==="P" && selRow===3 && allMoves[allMoves.length-1].piece==="p" && newRow===2 && newCol===allMoves[allMoves.length-1].toCol && allMoves[allMoves.length-1].toRow===3) removeEnpassedPawns("p",allMoves[allMoves.length-1].toRow,allMoves[allMoves.length-1].toCol)
            if(selPiece==="p" && selRow===4 && allMoves[allMoves.length-1].piece==="P" && newRow===5 && newCol===allMoves[allMoves.length-1].toCol && allMoves[allMoves.length-1].toRow===4) removeEnpassedPawns("P",allMoves[allMoves.length-1].toRow,allMoves[allMoves.length-1].toCol)
            //if pawns moves to last square
            if(selPiece==="P" && newRow===0) setPawnToLastSquarePosi({piece:"P",selRow:selRow,selCol:selCol,newRow:newRow,newCol:newCol})
            if(selPiece==="p" && newRow===7) setPawnToLastSquarePosi({piece:"p",selRow:selRow,selCol:selCol,newRow:newRow,newCol:newCol})

            //set that the castling is not possible if the rook is moved
            if(selPiece==="R" && selRow===7 && selCol===0 && whiteRookCastlePossible.left) setWhiteRookCastlePossible((prev)=>({...prev,left:false}))
            if(selPiece==="R" && selRow===7 && selCol===7 && whiteRookCastlePossible.right) setWhiteRookCastlePossible((prev)=>({...prev,right:false}))
            if(selPiece==="r" && selRow===0 && selCol===0 && blackRookCastlePossible.left) setBlackRookCastlePossible((prev)=>({...prev,left:false}))
            if(selPiece==="r" && selRow===0 && selCol===7 && blackRookCastlePossible.right) setBlackRookCastlePossible((prev)=>({...prev,right:false}))

            //set that the castling is not possible if the king is moved                
            if(selPiece==="K" && selRow===7 && selCol===4){
                if(whiteKingCastlePossible && whiteRookCastlePossible.left && newRow===7 && newCol===2){
                    handleRookPosiAfterCastling(7,0,3)
                }
                if(whiteKingCastlePossible && whiteRookCastlePossible.right && newRow===7 && newCol===6){
                    handleRookPosiAfterCastling(7,7,5)
                }
                setWhiteKingCastlePossible(false)
            }
            if(selPiece==="k" && selRow===0 && selCol===4){
                if(blackKingCastlePossible && blackRookCastlePossible.left && newRow===0 && newCol===2){
                    handleRookPosiAfterCastling(0,0,3)
                }
                if(blackKingCastlePossible && blackRookCastlePossible.right && newRow===0 && newCol===6){
                    handleRookPosiAfterCastling(0,7,5)
                }
                setBlackKingCastlePossible(false)
            }
        }
        else{
            //remove the enpassant pawns if enpassant move happens
            if(selPiece==="P" && selRow===4 && allMoves[allMoves.length-1].piece==="p" && newRow===5 && newCol===allMoves[allMoves.length-1].toCol && allMoves[allMoves.length-1].toRow===4) removeEnpassedPawns("p",allMoves[allMoves.length-1].toRow,allMoves[allMoves.length-1].toCol)
            if(selPiece==="p" && selRow===3 && allMoves[allMoves.length-1].piece==="P" && newRow===2 && newCol===allMoves[allMoves.length-1].toCol && allMoves[allMoves.length-1].toRow===3) removeEnpassedPawns("P",allMoves[allMoves.length-1].toRow,allMoves[allMoves.length-1].toCol)
            //if pawns moves to last square
            if(selPiece==="P" && newRow===7) setPawnToLastSquarePosi({piece:"P",selRow:selRow,selCol:selCol,newRow:newRow,newCol:newCol})
            if(selPiece==="p" && newRow===0) setPawnToLastSquarePosi({piece:"p",selRow:selRow,selCol:selCol,newRow:newRow,newCol:newCol})

            //set that the castling is not possible if the rook is moved
            if(selPiece==="R" && selRow===0 && selCol===0 && whiteRookCastlePossible.left) setWhiteRookCastlePossible((prev)=>({...prev,left:false}))
            if(selPiece==="R" && selRow===0 && selCol===7 && whiteRookCastlePossible.right) setWhiteRookCastlePossible((prev)=>({...prev,right:false}))
            if(selPiece==="r" && selRow===7 && selCol===0 && blackRookCastlePossible.left) setBlackRookCastlePossible((prev)=>({...prev,left:false}))
            if(selPiece==="r" && selRow===7 && selCol===7 && blackRookCastlePossible.right) setBlackRookCastlePossible((prev)=>({...prev,right:false}))

            //set that the castling is not possible if the king is moved
            if(selPiece==="K" && selRow===0 && selCol===4){
                if(whiteKingCastlePossible && whiteRookCastlePossible.left && newRow===0 && newCol===2){
                    handleRookPosiAfterCastling(0,0,3)
                }
                if(whiteKingCastlePossible && whiteRookCastlePossible.right && newRow===0 && newCol===6){
                    handleRookPosiAfterCastling(0,7,5)
                }
                setWhiteKingCastlePossible(false)
            }
            if(selPiece==="k" && selRow===7 && selCol===4){
                if(blackKingCastlePossible && blackRookCastlePossible.left && newRow===7 && newCol===2){
                    handleRookPosiAfterCastling(7,0,3)
                }
                if(blackKingCastlePossible && blackRookCastlePossible.right && newRow===7 && newCol===6){
                    handleRookPosiAfterCastling(7,7,5)
                }
                setBlackKingCastlePossible(false)
            }
        }

        //**set all the previous moves**
        setAllMoves((prev)=>{return [...prev,{piece:selPiece,fromRow:selRow,fromCol:selCol,toRow:newRow,toCol:newCol}]})

        //update the selected piece position
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
        }
        //3. select if another same colour piece is selected
        else if(isSelected && ((pieceColour===1 && moves%2===0 && whitePieces.includes(board[i][j])) || (pieceColour===1 && moves%2!==0 && blackPieces.includes(board[i][j])) || (pieceColour===0 && moves%2!==0 && whitePieces.includes(board[i][j])) || (pieceColour===0 && moves%2===0 && blackPieces.includes(board[i][j])))){
            setPossibleMovesForSelectedPiece([])
            setIsSelected(true)
            setSelectedPiece({piece:piece,row:i,col:j})
        }
        //4. update
        else if (isSelected && selectedPiece.piece!==null && selectedPiece.row!==null && selectedPiece.col!==null && possibleMovesForSelectedPiece.some((m)=>m.row===i && m.col===j)) {
            if(JSON.stringify(previousBoardPosi[0]) === JSON.stringify([]) && JSON.stringify(previousBoardPosi[1]) === JSON.stringify([])) setPreviousBoardPosi([[],board])
            else setPreviousBoardPosi([previousBoardPosi[1],board])

            updateSelectedPiecePosition(selectedPiece.piece, selectedPiece.row, selectedPiece.col, i, j)
            setIsSelected(false)
            setSelectedPiece({piece:null,row:null,col:null})
            setPossibleMovesForSelectedPiece([])
            setMoves((prev)=>prev+1)
        }
    }

    //Set possible moves for a selected piece
    useEffect(()=>{
        if(isSelected){
            if((pieceColour===1 && moves%2===0) || (pieceColour===0 && moves%2!==0)){
                const possibleMovesForPieceIfWhite = allPossibleMovesForWhite.find((item)=>(item.piece===selectedPiece.piece && item.posi.row===selectedPiece.row && item.posi.col===selectedPiece.col))
                if(possibleMovesForPieceIfWhite) setPossibleMovesForSelectedPiece(possibleMovesForPieceIfWhite?.moves)
            }
            else{
                const possibleMovesForPieceIfBlack = allPossibleMovesForBlack.find((item)=>(item.piece===selectedPiece.piece && item.posi.row===selectedPiece.row && item.posi.col===selectedPiece.col))
                if(possibleMovesForPieceIfBlack) setPossibleMovesForSelectedPiece(possibleMovesForPieceIfBlack?.moves)
            }
        }
        else{
            setPossibleMovesForSelectedPiece([])
        }
    },[isSelected,selectedPiece])

    //WHITE PAWN MOVES
    //1.one move 2.two moves 3&4.attack diagonally 6&7.if pawn protects any piece 9&10.enpassant move
    const findMovesForP = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        if(pieceColour===1){
            if(row>0 && Board[row-1][col]===" ") movesArray.push({row:row-1,col:col})
            if(row===6 && Board[row-2][col]===" " && Board[row-1][col]===" ") movesArray.push({row:row-2,col:col})
            if(row>0 && col>0 && blackPieces.includes(Board[row-1][col-1])) movesArray.push({row:row-1,col:col-1})
            if(row>0 && col<7 && blackPieces.includes(Board[row-1][col+1])) movesArray.push({row:row-1,col:col+1})
            if(forRealBoard){
                if(row>0 && col>0 && whitePieces.includes(Board[row-1][col-1])) protectedArray.push({row:row-1,col:col-1})
                if(row>0 && col<7 && whitePieces.includes(Board[row-1][col+1])) protectedArray.push({row:row-1,col:col+1})
            }
            if(row===3 && col>0 && Board[row][col-1]==="p" && allMoves[allMoves.length-1].piece==="p" && allMoves[allMoves.length-1].toRow===3 && allMoves[allMoves.length-1].toCol===col-1) movesArray.push({row:row-1,col:col-1})
            if(row===3 && col<7 && Board[row][col+1]==="p" && allMoves[allMoves.length-1].piece==="p" && allMoves[allMoves.length-1].toRow===3 && allMoves[allMoves.length-1].toCol===col+1) movesArray.push({row:row-1,col:col+1})
        }
        else{
            if(row<7 && Board[row+1][col]===" ") movesArray.push({row:row+1,col:col})
            if(row===1 && Board[row+2][col]===" " && Board[row+1][col]===" ") movesArray.push({row:row+2,col:col})
            if(row<7 && col<7 && blackPieces.includes(Board[row+1][col+1])) movesArray.push({row:row+1,col:col+1})
            if(row<7 && col>0 && blackPieces.includes(Board[row+1][col-1])) movesArray.push({row:row+1,col:col-1})
            if(forRealBoard){
                if(row<7 && col<7 && whitePieces.includes(Board[row+1][col+1])) protectedArray.push({row:row+1,col:col+1})
                if(row<7 && col>0 && whitePieces.includes(Board[row+1][col-1])) protectedArray.push({row:row+1,col:col-1})
            }
            if(row===4 && col>0 && Board[row][col-1]==="p" && allMoves[allMoves.length-1].piece==="p" && allMoves[allMoves.length-1].toRow===4 && allMoves[allMoves.length-1].toCol===col-1) movesArray.push({row:row+1,col:col-1})
            if(row===4 && col<7 && Board[row][col+1]==="p" && allMoves[allMoves.length-1].piece==="p" && allMoves[allMoves.length-1].toRow===4 && allMoves[allMoves.length-1].toCol===col+1) movesArray.push({row:row+1,col:col+1})
        }
        if(forRealBoard) setAllPossibleMovesForWhite((prev)=>[...prev,{piece:"P",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}])
        else setAllTempPossibleMovesForWhite((prev)=>[...prev,{piece:"P",posi:{row:row,col:col},moves:movesArray}])
    }

    //BLACK PAWN MOVES
    //1.one move 2.two moves 3&4.attack diagonally 6&7.if pawn protects any piece 9&10.enpassant move
    const findMovesForp = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        if(pieceColour===1){
            if(row<7 && Board[row+1][col]===" ") movesArray.push({row:row+1,col:col})
            if(row===1 && Board[row+2][col]===" " && Board[row+1][col]===" ") movesArray.push({row:row+2,col:col})
            if(row<7 && col<7 && whitePieces.includes(Board[row+1][col+1])) movesArray.push({row:row+1,col:col+1})
            if(row<7 && col>0 && whitePieces.includes(Board[row+1][col-1])) movesArray.push({row:row+1,col:col-1})
            if(forRealBoard){
                if(row<7 && col<7 && blackPieces.includes(Board[row+1][col+1])) protectedArray.push({row:row+1,col:col+1})
                if(row<7 && col>0 && blackPieces.includes(Board[row+1][col-1])) protectedArray.push({row:row+1,col:col-1})
            }
            if(row===4 && col>0 && Board[row][col-1]==="P" && allMoves[allMoves.length-1].piece==="P" && allMoves[allMoves.length-1].toRow===4 && allMoves[allMoves.length-1].toCol===col-1) movesArray.push({row:row+1,col:col-1})
            if(row===4 && col<7 && Board[row][col+1]==="P" && allMoves[allMoves.length-1].piece==="P" && allMoves[allMoves.length-1].toRow===4 && allMoves[allMoves.length-1].toCol===col+1) movesArray.push({row:row+1,col:col+1})
            
        }
        else{
            if(row>0 && Board[row-1][col]===" ") movesArray.push({row:row-1,col:col})
            if(row===6 && Board[row-2][col]===" " && Board[row-1][col]===" ") movesArray.push({row:row-2,col:col})
            if(row>0 && col>0 && whitePieces.includes(Board[row-1][col-1])) movesArray.push({row:row-1,col:col-1})
            if(row>0 && col<7 && whitePieces.includes(Board[row-1][col+1])) movesArray.push({row:row-1,col:col+1})
            if(forRealBoard){
                if(row>0 && col>0 && blackPieces.includes(Board[row-1][col-1])) protectedArray.push({row:row-1,col:col-1})
                if(row>0 && col<7 && blackPieces.includes(Board[row-1][col+1])) protectedArray.push({row:row-1,col:col+1})
            }
            if(row===3 && col>0 && Board[row][col-1]==="P" && allMoves[allMoves.length-1].piece==="P" && allMoves[allMoves.length-1].toRow===3 && allMoves[allMoves.length-1].toCol===col-1) movesArray.push({row:row-1,col:col-1})
            if(row===3 && col<7 && Board[row][col+1]==="P" && allMoves[allMoves.length-1].piece==="P" && allMoves[allMoves.length-1].toRow===3 && allMoves[allMoves.length-1].toCol===col+1) movesArray.push({row:row-1,col:col+1})
        }
        if(forRealBoard) setAllPossibleMovesForBlack((prev)=>[...prev,{piece:"p",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}])
        else setAllTempPossibleMovesForBlack((prev)=>[...prev,{piece:"p",posi:{row:row,col:col},moves:movesArray}])
    }

    //WHITE KNIGHT MOVES
    const findMovesForN = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        //BIG L
        if(row-2>=0 && col+1<8 && !whitePieces.includes(Board[row-2][col+1])) movesArray.push({row:row-2,col:col+1})
        if(row-2>=0 && col-1>=0 && !whitePieces.includes(Board[row-2][col-1])) movesArray.push({row:row-2,col:col-1})
        if(row+2<8 && col+1<8 && !whitePieces.includes(Board[row+2][col+1])) movesArray.push({row:row+2,col:col+1})
        if(row+2<8 && col-1>=0 && !whitePieces.includes(Board[row+2][col-1])) movesArray.push({row:row+2,col:col-1})
        
        if(forRealBoard){
            if(row-2>=0 && col+1<8 && whitePieces.includes(Board[row-2][col+1])) protectedArray.push({row:row-2,col:col+1})
            if(row-2>=0 && col-1>=0 && whitePieces.includes(Board[row-2][col-1])) protectedArray.push({row:row-2,col:col-1})
            if(row+2<8 && col+1<8 && whitePieces.includes(Board[row+2][col+1])) protectedArray.push({row:row+2,col:col+1})
            if(row+2<8 && col-1>=0 && whitePieces.includes(Board[row+2][col-1])) protectedArray.push({row:row+2,col:col-1})
        }

        //SMALL L
        if(row-1>=0 && col+2<8 && !whitePieces.includes(Board[row-1][col+2])) movesArray.push({row:row-1,col:col+2})
        if(row-1>=0 && col-2>=0 && !whitePieces.includes(Board[row-1][col-2])) movesArray.push({row:row-1,col:col-2})
        if(row+1<8 && col+2<8 && !whitePieces.includes(Board[row+1][col+2])) movesArray.push({row:row+1,col:col+2})
        if(row+1<8 && col-2>=0 && !whitePieces.includes(Board[row+1][col-2])) movesArray.push({row:row+1,col:col-2})

        if(forRealBoard){
            if(row-1>=0 && col+2<8 && whitePieces.includes(Board[row-1][col+2])) protectedArray.push({row:row-1,col:col+2})
            if(row-1>=0 && col-2>=0 && whitePieces.includes(Board[row-1][col-2])) protectedArray.push({row:row-1,col:col-2})
            if(row+1<8 && col+2<8 && whitePieces.includes(Board[row+1][col+2])) protectedArray.push({row:row+1,col:col+2})
            if(row+1<8 && col-2>=0 && whitePieces.includes(Board[row+1][col-2])) protectedArray.push({row:row+1,col:col-2})
        }

        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForWhite((prev) => {return [...prev,{piece:"N",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
        }
        else setAllTempPossibleMovesForWhite((prev) => {return [...prev,{piece:"N",posi:{row:row,col:col},moves:movesArray}]})
    }

    //BLACK KNIGHT MOVES
    const findMovesForn = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        //BIG L
        if(row+2<8 && col+1<8 && !blackPieces.includes(Board[row+2][col+1])) movesArray.push({row:row+2,col:col+1})        
        if(row+2<8 && col-1>=0 && !blackPieces.includes(Board[row+2][col-1])) movesArray.push({row:row+2,col:col-1})
        if(row-2>=0 && col+1<8 && !blackPieces.includes(Board[row-2][col+1])) movesArray.push({row:row-2,col:col+1})
        if(row-2>=0 && col-1>=0 && !blackPieces.includes(Board[row-2][col-1])) movesArray.push({row:row-2,col:col-1})

        if(forRealBoard){
            if(row+2<8 && col+1<8 && blackPieces.includes(Board[row+2][col+1])) protectedArray.push({row:row+2,col:col+1})        
            if(row+2<8 && col-1>=0 && blackPieces.includes(Board[row+2][col-1])) protectedArray.push({row:row+2,col:col-1})
            if(row-2>=0 && col+1<8 && blackPieces.includes(Board[row-2][col+1])) protectedArray.push({row:row-2,col:col+1})
            if(row-2>=0 && col-1>=0 && blackPieces.includes(Board[row-2][col-1])) protectedArray.push({row:row-2,col:col-1})
        }

        //SMALL L
        if(row+1<8 && col+2<8 && !blackPieces.includes(Board[row+1][col+2])) movesArray.push({row:row+1,col:col+2})
        if(row+1<8 && col-2>=0 && !blackPieces.includes(Board[row+1][col-2])) movesArray.push({row:row+1,col:col-2})
        if(row-1>=0 && col+2<8 && !blackPieces.includes(Board[row-1][col+2])) movesArray.push({row:row-1,col:col+2})
        if(row-1>=0 && col-2>=0 && !blackPieces.includes(Board[row-1][col-2])) movesArray.push({row:row-1,col:col-2})

        if(forRealBoard){
            if(row+1<8 && col+2<8 && blackPieces.includes(Board[row+1][col+2])) protectedArray.push({row:row+1,col:col+2})
            if(row+1<8 && col-2>=0 && blackPieces.includes(Board[row+1][col-2])) protectedArray.push({row:row+1,col:col-2})
            if(row-1>=0 && col+2<8 && blackPieces.includes(Board[row-1][col+2])) protectedArray.push({row:row-1,col:col+2})
            if(row-1>=0 && col-2>=0 && blackPieces.includes(Board[row-1][col-2])) protectedArray.push({row:row-1,col:col-2})
        }

        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForBlack((prev) => {return [...prev,{piece:"n",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
        }
        else setAllTempPossibleMovesForBlack((prev) => {return [...prev,{piece:"n",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
    }

    //WHITE ROOK MOVES
    const findMovesForR = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        for(let i=row+1;i<8;i++){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(blackPieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=row-1;i>=0;i--){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(blackPieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=col+1;i<8;i++){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(blackPieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }
        for(let i=col-1;i>=0;i--){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(blackPieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }
        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForWhite((prev)=>{return [...prev,{piece:"R",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
        }
        else setAllTempPossibleMovesForWhite((prev)=>{return [...prev,{piece:"R",posi:{row:row,col:col},moves:movesArray}]})
    }

    //BLACK ROOK MOVES
    const findMovesForr = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        for(let i=row+1;i<8;i++){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(whitePieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=row-1;i>=0;i--){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(whitePieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=col+1;i<8;i++){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(whitePieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }
        for(let i=col-1;i>=0;i--){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(whitePieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }
        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForBlack((prev)=>{return [...prev,{piece:"r",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
        }
        else setAllTempPossibleMovesForBlack((prev)=>{return [...prev,{piece:"r",posi:{row:row,col:col},moves:movesArray}]})
    }

    //WHITE BISHOP MOVES
    const findMovesForB = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        let tempCol = col
        for(let i=row-1;i>=0 && col-1>=0;i--){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(blackPieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row-1;i>=0 && col+1<8;i--){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(blackPieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col-1>=0;i++){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(blackPieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col+1<8;i++){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(blackPieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol

        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForWhite((prev)=>{return [...prev,{piece:"B",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
        }
        else setAllTempPossibleMovesForWhite((prev)=>{return [...prev,{piece:"B",posi:{row:row,col:col},moves:movesArray}]})
    }

    //BLACK BISHOP MOVES
    const findMovesForb = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        let tempCol = col
        for(let i=row-1;i>=0 && col-1>=0;i--){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(whitePieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row-1;i>=0 && col+1<8;i--){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(whitePieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col-1>=0;i++){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(whitePieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col+1<8;i++){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(whitePieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol
        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForBlack((prev)=>{return [...prev,{piece:"b",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
        }
        else setAllTempPossibleMovesForBlack((prev)=>{return [...prev,{piece:"b",posi:{row:row,col:col},moves:movesArray}]})
    }

    //WHITE QUEEN MOVES
    const findMovesForQ = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        //ROOK MOVES
        for(let i=row+1;i<8;i++){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(blackPieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=row-1;i>=0;i--){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(blackPieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=col+1;i<8;i++){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(blackPieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }
        for(let i=col-1;i>=0;i--){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(blackPieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }

        //BISHOP MOVES
        let tempCol = col
        for(let i=row-1;i>=0 && col-1>=0;i--){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(blackPieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row-1;i>=0 && col+1<8;i--){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(blackPieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col-1>=0;i++){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(blackPieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col+1<8;i++){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(blackPieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol
        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForWhite((prev)=>{return [...prev,{piece:"Q",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
            setWhiteComp(true)
        }
        else setAllTempPossibleMovesForWhite((prev)=>{return [...prev,{piece:"Q",posi:{row:row,col:col},moves:movesArray}]})
    }

    //BLACK QUEEN MOVES
    const findMovesForq = (row:number, col:number, forRealBoard:boolean, Board:string[][]) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        //ROOK MOVES
        for(let i=row+1;i<8;i++){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(whitePieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=row-1;i>=0;i--){
            if(Board[i][col]===" ") movesArray.push({row:i,col:col})
            else if(whitePieces.includes(Board[i][col])){
                movesArray.push({row:i,col:col})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col})
                break
            }
            else break
        }
        for(let i=col+1;i<8;i++){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(whitePieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }
        for(let i=col-1;i>=0;i--){
            if(Board[row][i]===" ") movesArray.push({row:row,col:i})
            else if(whitePieces.includes(Board[row][i])){
                movesArray.push({row:row,col:i})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:row,col:i})
                break
            }
            else break
        }

        //BISHOP MOVES
        let tempCol = col
        for(let i=row-1;i>=0 && col-1>=0;i--){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(whitePieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row-1;i>=0 && col+1<8;i--){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(whitePieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }

        col=tempCol
        for(let i=row+1;i<8 && col-1>=0;i++){
            if(Board[i][col-1]===" ") movesArray.push({row:i,col:col-1})
            else if(whitePieces.includes(Board[i][col-1])){
                movesArray.push({row:i,col:col-1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col-1})
                break
            }
            else break
            col-=1
        }
        col=tempCol
        for(let i=row+1;i<8 && col+1<8;i++){
            if(Board[i][col+1]===" ") movesArray.push({row:i,col:col+1})
            else if(whitePieces.includes(Board[i][col+1])){
                movesArray.push({row:i,col:col+1})
                break
            }
            else if(forRealBoard){
                protectedArray.push({row:i,col:col+1})
                break
            }
            else break
            col+=1
        }
        col=tempCol
        if(forRealBoard){
            if(movesArray.length>0) setAllPossibleMovesForBlack((prev)=>{return [...prev,{piece:"q",posi:{row:row,col:col},moves:movesArray,protected:protectedArray}]})
            setBlackComp(true)
        }
        else setAllTempPossibleMovesForBlack((prev)=>{return [...prev,{piece:"q",posi:{row:row,col:col},moves:movesArray}]})
    }

    const filterMovesForWhiteKing = (row:number, col:number, movesArray: { row: number; col: number }[]) => {
        const removeMoves:{ row: number; col: number }[] = []
        const filteredMovesArray = movesArray.filter((move) => {
            return !allPossibleMovesForBlack.some((expiece) => {
                if (expiece.piece === "p") {
                    if (pieceColour === 1) {
                        return (
                            (expiece.posi.row + 1 === move.row && expiece.posi.col + 1 === move.col) ||
                            (expiece.posi.row + 1 === move.row && expiece.posi.col - 1 === move.col)
                        )
                    } else {
                        return (
                            (expiece.posi.row - 1 === move.row && expiece.posi.col + 1 === move.col) ||
                            (expiece.posi.row - 1 === move.row && expiece.posi.col - 1 === move.col)
                        )
                    }
                }
                else if(expiece.piece==="r"){
                    const isSameRow = expiece.posi.row===row
                    const isSameCol = expiece.posi.col===col
                    const ifAttacked = expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                    if(ifAttacked && isSameRow){
                        if(col<expiece.posi.col) removeMoves.push({row:row,col:col-1})
                        else removeMoves.push({row:row,col:col+1})
                    }
                    if(ifAttacked && isSameCol){
                        if(expiece.posi.row<row) removeMoves.push({row:row+1,col:col})
                        else removeMoves.push({row:row-1,col:col})
                    }
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
                else if(expiece.piece==="b"){
                    const isSameLeftDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col<col) || (expiece.posi.row>row && expiece.posi.col>col))
                    const isSameRightDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col>col) || (expiece.posi.row>row && expiece.posi.col<col))
                    const ifAttacked = expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                    if(ifAttacked && isSameLeftDiag){
                        if(expiece.posi.row<row && expiece.posi.col<col) removeMoves.push({row:row+1,col:col+1})
                        else removeMoves.push({row:row-1,col:col-1})
                    }
                    if(ifAttacked && isSameRightDiag){
                        if(expiece.posi.row<row && expiece.posi.col>col) removeMoves.push({row:row+1,col:col-1})
                        else removeMoves.push({row:row-1,col:col+1})
                    }
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
                else if(expiece.piece==="q"){
                    const isSameRow = expiece.posi.row===row
                    const isSameCol = expiece.posi.col===col
                    const ifAttacked = expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                    if(ifAttacked && isSameRow){
                        if(col<expiece.posi.col) removeMoves.push({row:row,col:col-1})
                        else removeMoves.push({row:row,col:col+1})
                    }
                    if(ifAttacked && isSameCol){
                        if(expiece.posi.row<row) removeMoves.push({row:row+1,col:col})
                        else removeMoves.push({row:row-1,col:col})
                    }

                    const isSameLeftDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col<col) || (expiece.posi.row>row && expiece.posi.col>col))
                    const isSameRightDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col>col) || (expiece.posi.row>row && expiece.posi.col<col))
                    
                    if(ifAttacked && isSameLeftDiag){
                        if(expiece.posi.row<row && expiece.posi.col<col) removeMoves.push({row:row+1,col:col+1})
                        else removeMoves.push({row:row-1,col:col-1})
                    }
                    if(ifAttacked && isSameRightDiag){
                        if(expiece.posi.row<row && expiece.posi.col>col) removeMoves.push({row:row+1,col:col-1})
                        else removeMoves.push({row:row-1,col:col+1})
                    }
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
                else {
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
            })
        })
        
        const newFilteredMovesArray = filteredMovesArray.filter((move)=>{return !(removeMoves.some((rMove)=>rMove.row===move.row && rMove.col===move.col))})
        return newFilteredMovesArray
    }


    //WHITE KING MOVES 
    const findMovesForK= (row:number, col:number) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        if(row-1>=0 && (board[row-1][col]===" " || blackPieces.includes(board[row-1][col]))) movesArray.push({row:row-1,col:col})
        if(row+1<8 && (board[row+1][col]===" " || blackPieces.includes(board[row+1][col]))) movesArray.push({row:row+1,col:col})
        if(col-1>=0 && (board[row][col-1]===" " || blackPieces.includes(board[row][col-1]))) movesArray.push({row:row,col:col-1})
        if(col+1<8 && (board[row][col+1]===" " || blackPieces.includes(board[row][col+1]))) movesArray.push({row:row,col:col+1})

        if(row-1>=0 && (whitePieces.includes(board[row-1][col]))) protectedArray.push({row:row-1,col:col})
        if(row+1<8 && (whitePieces.includes(board[row+1][col]))) protectedArray.push({row:row+1,col:col})
        if(col-1>=0 && (whitePieces.includes(board[row][col-1]))) protectedArray.push({row:row,col:col-1})
        if(col+1<8 && (whitePieces.includes(board[row][col+1]))) protectedArray.push({row:row,col:col+1})

        if(row-1>=0 && col-1>=0 && (board[row-1][col-1]===" " || blackPieces.includes(board[row-1][col-1]))) movesArray.push({row:row-1,col:col-1})
        if(row-1>=0 && col+1<8 && (board[row-1][col+1]===" " || blackPieces.includes(board[row-1][col+1]))) movesArray.push({row:row-1,col:col+1})
        if(row+1<8 && col-1>=0 && (board[row+1][col-1]===" " || blackPieces.includes(board[row+1][col-1]))) movesArray.push({row:row+1,col:col-1})
        if(row+1<8 && col+1<8 && (board[row+1][col+1]===" " || blackPieces.includes(board[row+1][col+1]))) movesArray.push({row:row+1,col:col+1})

        if(row-1>=0 && col-1>=0 && (whitePieces.includes(board[row-1][col-1]))) protectedArray.push({row:row-1,col:col-1})
        if(row-1>=0 && col+1<8 && (whitePieces.includes(board[row-1][col+1]))) protectedArray.push({row:row-1,col:col+1})
        if(row+1<8 && col-1>=0 && (whitePieces.includes(board[row+1][col-1]))) protectedArray.push({row:row+1,col:col-1})
        if(row+1<8 && col+1<8 && (whitePieces.includes(board[row+1][col+1]))) protectedArray.push({row:row+1,col:col+1})
        
        if(whiteKingCastlePossible && whiteRookCastlePossible.left && !findThreatToWhiteKing(true,board) && !checkMiddleSquaresAttacked("white","left")) movesArray.push({row:row,col:col-2})
        if(whiteKingCastlePossible && whiteRookCastlePossible.right && !findThreatToWhiteKing(true,board) && !checkMiddleSquaresAttacked("white","right")) movesArray.push({row:row,col:col+2})

        if((pieceColour===1 && moves%2!==0) || (pieceColour===0 && moves%2===0)){
            setAllPossibleMovesForWhite((prev)=>{return [...prev,{piece:"K",posi:{row:row,col:col},moves:movesArray, protected:protectedArray}]})
        }
        else{
            const filteredMovesArray = filterMovesForWhiteKing(row,col,movesArray)
            const newFilteredMovesArray = filteredMovesArray.filter((move)=>(!allPossibleMovesForBlack.some((piece)=>piece.protected.some((m)=>m.row===move.row && m.col===move.col))))
            if(newFilteredMovesArray.length>0){
                if(allPossibleMovesForWhite.some((piece)=>piece.piece==="K")){
                    setAllPossibleMovesForWhite((prev)=>{return prev.map((piece) => { return piece.piece === "K" ? { piece: "K", posi: { row: row, col: col }, moves: newFilteredMovesArray, protected:protectedArray } : piece })})
                }
                else{
                    setAllPossibleMovesForWhite((prev)=>{return [...prev,{piece:"K",posi:{row:row,col:col},moves:newFilteredMovesArray, protected:protectedArray}]})
                }
            }
            else{
                if(allPossibleMovesForWhite.some((piece)=>piece.piece==="K")){
                    setAllPossibleMovesForWhite((prev)=>{return prev.map((piece) => { return piece.piece === "K" ? { piece: "K", posi: { row: row, col: col }, moves: [], protected:protectedArray } : piece })})
                }
                else{
                    setAllPossibleMovesForWhite((prev)=>{return [...prev,{piece:"K",posi:{row:row,col:col},moves:[], protected:protectedArray}]})
                }
            }
        }
    }

    const filterMovesForBlackKing = (row:number, col:number, movesArray: { row: number; col: number }[]) => {
        const removeMoves:{ row: number; col: number }[] = []
        const filteredMovesArray = movesArray.filter((move) => {
            return !allPossibleMovesForWhite.some((expiece) => {
                if (expiece.piece === "P") {
                    if (pieceColour === 1) {
                        return (
                            (expiece.posi.row - 1 === move.row && expiece.posi.col + 1 === move.col) ||
                            (expiece.posi.row - 1 === move.row && expiece.posi.col - 1 === move.col)
                        )
                    } else {
                        return (
                            (expiece.posi.row + 1 === move.row && expiece.posi.col + 1 === move.col) ||
                            (expiece.posi.row + 1 === move.row && expiece.posi.col - 1 === move.col)
                        )
                    }
                } 
                else if(expiece.piece==="R"){
                    const isSameRow = expiece.posi.row===row
                    const isSameCol = expiece.posi.col===col
                    const ifAttacked = expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                    if(ifAttacked && isSameRow){
                        if(col<expiece.posi.col) removeMoves.push({row:row,col:col-1})
                        else removeMoves.push({row:row,col:col+1})
                    }
                    if(ifAttacked && isSameCol){
                        if(expiece.posi.row<row) removeMoves.push({row:row+1,col:col})
                        else removeMoves.push({row:row-1,col:col})
                    }
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
                else if(expiece.piece==="B"){
                    const isSameLeftDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col<col) || (expiece.posi.row>row && expiece.posi.col>col))
                    const isSameRightDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col>col) || (expiece.posi.row>row && expiece.posi.col<col))
                    const ifAttacked = expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                    if(ifAttacked && isSameLeftDiag){
                        if(expiece.posi.row<row && expiece.posi.col<col) removeMoves.push({row:row+1,col:col+1})
                        else removeMoves.push({row:row-1,col:col-1})
                    }
                    if(ifAttacked && isSameRightDiag){
                        if(expiece.posi.row<row && expiece.posi.col>col) removeMoves.push({row:row+1,col:col-1})
                        else removeMoves.push({row:row-1,col:col+1})
                    }
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
                else if(expiece.piece==="Q"){
                    const isSameRow = expiece.posi.row===row
                    const isSameCol = expiece.posi.col===col
                    const ifAttacked = expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                    if(ifAttacked && isSameRow){
                        if(col<expiece.posi.col) removeMoves.push({row:row,col:col-1})
                        else removeMoves.push({row:row,col:col+1})
                    }
                    if(ifAttacked && isSameCol){
                        if(expiece.posi.row<row) removeMoves.push({row:row+1,col:col})
                        else removeMoves.push({row:row-1,col:col})
                    }

                    const isSameLeftDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col<col) || (expiece.posi.row>row && expiece.posi.col>col))
                    const isSameRightDiag = expiece.posi.row-row===expiece.posi.col-col && ((expiece.posi.row<row && expiece.posi.col>col) || (expiece.posi.row>row && expiece.posi.col<col))
                    
                    if(ifAttacked && isSameLeftDiag){
                        if(expiece.posi.row<row && expiece.posi.col<col) removeMoves.push({row:row+1,col:col+1})
                        else removeMoves.push({row:row-1,col:col-1})
                    }
                    if(ifAttacked && isSameRightDiag){
                        if(expiece.posi.row<row && expiece.posi.col>col) removeMoves.push({row:row+1,col:col-1})
                        else removeMoves.push({row:row-1,col:col+1})
                    }
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
                else {
                    return expiece.moves.some(
                        (exmove) => exmove.row === move.row && exmove.col === move.col
                    )
                }
            })
        })
        const newFilteredMovesArray = filteredMovesArray.filter((move)=>{return !(removeMoves.some((rMove)=>rMove.row===move.row && rMove.col===move.col))})
        return newFilteredMovesArray
    }

    //BLACK KING MOVES 
    const findMovesFork= (row:number, col:number) => {
        const movesArray:{row:number,col:number}[] = []
        const protectedArray:{row:number,col:number}[] = []
        if(row-1>=0 && (board[row-1][col]===" " || whitePieces.includes(board[row-1][col]))) movesArray.push({row:row-1,col:col})
        if(row+1<8 && (board[row+1][col]===" " || whitePieces.includes(board[row+1][col]))) movesArray.push({row:row+1,col:col})
        if(col-1>=0 && (board[row][col-1]===" " || whitePieces.includes(board[row][col-1]))) movesArray.push({row:row,col:col-1})
        if(col+1<8 && (board[row][col+1]===" " || whitePieces.includes(board[row][col+1]))) movesArray.push({row:row,col:col+1})

        if(row-1>=0 && (blackPieces.includes(board[row-1][col]))) protectedArray.push({row:row-1,col:col})
        if(row+1<8 && (blackPieces.includes(board[row+1][col]))) protectedArray.push({row:row+1,col:col})
        if(col-1>=0 && (blackPieces.includes(board[row][col-1]))) protectedArray.push({row:row,col:col-1})
        if(col+1<8 && (blackPieces.includes(board[row][col+1]))) protectedArray.push({row:row,col:col+1})

        if(row-1>=0 && col-1>=0 && (board[row-1][col-1]===" " || whitePieces.includes(board[row-1][col-1]))) movesArray.push({row:row-1,col:col-1})
        if(row-1>=0 && col+1<8 && (board[row-1][col+1]===" " || whitePieces.includes(board[row-1][col+1]))) movesArray.push({row:row-1,col:col+1})
        if(row+1<8 && col-1>=0 && (board[row+1][col-1]===" " || whitePieces.includes(board[row+1][col-1]))) movesArray.push({row:row+1,col:col-1})
        if(row+1<8 && col+1<8 && (board[row+1][col+1]===" " || whitePieces.includes(board[row+1][col+1]))) movesArray.push({row:row+1,col:col+1})
        
        if(row-1>=0 && col-1>=0 && (blackPieces.includes(board[row-1][col-1]))) protectedArray.push({row:row-1,col:col-1})
        if(row-1>=0 && col+1<8 && (blackPieces.includes(board[row-1][col+1]))) protectedArray.push({row:row-1,col:col+1})
        if(row+1<8 && col-1>=0 && (blackPieces.includes(board[row+1][col-1]))) protectedArray.push({row:row+1,col:col-1})
        if(row+1<8 && col+1<8 && (blackPieces.includes(board[row+1][col+1]))) protectedArray.push({row:row+1,col:col+1})
        
        if(blackKingCastlePossible && blackRookCastlePossible.left && !findThreatToBlackKing(true,board) && !checkMiddleSquaresAttacked("black","left")) movesArray.push({row:row,col:col-2})
        if(blackKingCastlePossible && blackRookCastlePossible.right && !findThreatToBlackKing(true,board) && !checkMiddleSquaresAttacked("black","right")) movesArray.push({row:row,col:col+2})

        if((pieceColour===1 && moves%2===0) || (pieceColour===0 && moves%2!==0)){
            setAllPossibleMovesForBlack((prev)=>{return [...prev,{piece:"k",posi:{row:row,col:col},moves:movesArray, protected:protectedArray}]})
        }
        else{
            const filteredMovesArray = filterMovesForBlackKing(row,col,movesArray)
            const newFilteredMovesArray = filteredMovesArray.filter((move)=>(!allPossibleMovesForWhite.some((piece)=>piece.protected.some((m)=>m.row===move.row && m.col===move.col))))
            if(newFilteredMovesArray.length>0){
                if(allPossibleMovesForBlack.some((piece)=>piece.piece==="k")){
                    setAllPossibleMovesForBlack((prev)=>{return prev.map((piece) => { return piece.piece === "k" ? { piece: "k", posi: { row: row, col: col }, moves: newFilteredMovesArray, protected:protectedArray } : piece })})
                }
                else{
                    setAllPossibleMovesForBlack((prev)=>{return [...prev,{piece:"k",posi:{row:row,col:col},moves:newFilteredMovesArray, protected:protectedArray}]})
                }
            }
            else{
                if(allPossibleMovesForBlack.some((piece)=>piece.piece==="k")){
                    setAllPossibleMovesForBlack((prev)=>{return prev.map((piece) => { return piece.piece === "k" ? { piece: "k", posi: { row: row, col: col }, moves: [], protected:protectedArray } : piece })})
                }
                else{
                    setAllPossibleMovesForBlack((prev)=>{return [...prev,{piece:"k",posi:{row:row,col:col},moves:[], protected:protectedArray}]})
                }
            }
        }
    }

    const [whiteComp,setWhiteComp] = useState(false)
    const [blackComp, setBlackComp] = useState(false)

    //Now for each white piece selected find all the moves that are possible
    useEffect(()=>{
        curWhite.forEach((key)=>{
            if(key.piece==="P") findMovesForP(key.row,key.col,true,board)
            if(key.piece==="N") findMovesForN(key.row,key.col,true,board)
            if(key.piece==="R") findMovesForR(key.row,key.col,true,board)
            if(key.piece==="B") findMovesForB(key.row,key.col,true,board)
            if(key.piece==="Q") findMovesForQ(key.row,key.col,true,board)
            if(key.piece==="K") findMovesForK(key.row,key.col)
        })
    },[curWhite])

    //Now for each black piece selected find all the moves that are possible
    useEffect(()=>{
        curBlack.forEach((key)=>{
            if(key.piece==="p") findMovesForp(key.row,key.col,true,board)
            if(key.piece==="n") findMovesForn(key.row,key.col,true,board)
            if(key.piece==="r") findMovesForr(key.row,key.col,true,board)
            if(key.piece==="b") findMovesForb(key.row,key.col,true,board)
            if(key.piece==="q") findMovesForq(key.row,key.col,true,board)
            if(key.piece==="k") findMovesFork(key.row,key.col)
        })
    },[curBlack])

    useEffect(()=>{
        if(blackComp && ((pieceColour===1 && moves%2===0) || (pieceColour===0 && moves%2!==0))){
            curWhite.some((piece)=>{
                if(piece.piece==="K"){
                    findMovesForK(piece.row,piece.col)
                }
            })
        }
        setBlackComp(false)
    },[pieceColour,moves,blackComp])

    useEffect(()=>{
        if(whiteComp && ((pieceColour===1 && moves%2!==0) || (pieceColour===0 && moves%2===0))){
            curBlack.some((piece)=>{
                if(piece.piece==="k"){
                    findMovesFork(piece.row,piece.col)
                }
            })
        }
        setWhiteComp(false)
    },[pieceColour,moves,whiteComp])

    // Function to select all the white pieces present on the board
    const handleAllWhitePieces = () => {
        setCurWhite([])
        const newCurWhite: { piece: string; row: number; col: number }[] = []
        board.forEach((x, i) => {
            x.forEach((y, j) => {
                if (whitePieces.includes(y)) {
                    newCurWhite.push({ piece: y, row: i, col: j })
                }
            });
        });
        setCurWhite(newCurWhite)
    }

    // Function to select all the black pieces present on the board
    const handleAllBlackPieces = () => {
        setCurBlack([])
        const newCurBlack: { piece: string; row: number; col: number }[] = []
        board.forEach((x, i) => {
            x.forEach((y, j) => {
                if (blackPieces.includes(y)) {
                    newCurBlack.push({ piece: y, row: i, col: j });
                }
            });
        });
        setCurBlack(newCurBlack)
    }

    // Based on the turn, i.e., white/black, calculate the moves in the respective order
    useEffect(() => {
        setAllPossibleMovesForWhite([])
        setAllPossibleMovesForBlack([])

            if ((pieceColour === 1 && moves % 2 === 0) || (pieceColour === 0 && moves % 2 !== 0)) {
                // If it is white turn, handle black pieces first, then 
                handleAllBlackPieces()
                handleAllWhitePieces()
            } else {
                // If it is black turn, handle white pieces first, then black
                handleAllWhitePieces()
                handleAllBlackPieces()
            }
    },[pieceColour,moves])

    return(
        <main className="h-full w-full">
            <div className="flex flex-col justify-center items-center p-2">
                <div className="flex justify-center items-center gap-3 ml-[48%] md:ml-[22%] mb-1">
                    {JSON.stringify(previousBoardPosi[0])!==JSON.stringify([]) && JSON.stringify(previousBoardPosi[1])!==JSON.stringify([]) ? <div className="border-2 border-blue-500 rounded-md bg-white transform scale-y-[-1] scale-x-[-1]" onClick={()=>setTopPlayerChoosePrev(true)}><MdSkipPrevious color="#3b82f6" size={30} /></div> : <div className="w-8"></div>}
                    <div key="sw-1" className={`${pieceColour===1 ? `${moves%2!==0 ? "bg-black" : "bg-gray-600"} text-white` : "bg-white text-black"} flex justify-center items-center border-2 border-blue-500 font-bold font-technology text-base md:text-xl p-1 rounded-md gap-2 transform scale-y-[-1] scale-x-[-1]`}>
                        <div className="">{(Math.floor(time/60)===0) ? `00 : 00:${time}` : 
                        (Math.floor(time/3600)===0) ? `00 : ${time/60<10 ? `0${time/60}` :time/60} : ${time%60<10 ? `0${time%60}` : time%60}`
                        : `0${Math.floor(time/3600)} : ${(Math.floor(time/60)%60)<10 ? `0${(Math.floor(time/60)%60)}` : (Math.floor(time/60)%60)} : ${time%60<10 ? `0${time%60}` : time%60}`}
                        </div>
                        <div className="w-5">{moves%2!==0 ? <FaStopwatch color={`${pieceColour===1 ? "white" : "black"}`} /> : ""}</div>
                    </div>
                </div>
                <div className="relative" style={{ border: "10px solid transparent",borderImage: "url('/images/woodenbg.jpg') 15 round"}}>
                    {pawnToLastSquarePosi.piece!==null ? 
                    <div className="absolute inset-0 flex bg-white justify-center items-center bg-opacity-60 z-80">
                        <div className="flex flex-col justify-center items-center gap-2 lg:gap-3">
                            <div>
                                <div className={`border-2 ${pawnToLastSquarePosi.piece==="P" ? "border-white bg-gray-700" : "border-black bg-slate-400"} p-2 lg:p-3 rounded-md`} onClick={()=>{pawnToLastSquarePosi.piece==="P" ? handlePawnToLastSquare("Q") : handlePawnToLastSquare("q")}}>{pawnToLastSquarePosi.piece==="P" ? <ChessPiece col="Q"/> : <ChessPiece col="q"/>}</div>
                            </div>
                            <div className="flex gap-2">
                                <div className={`border-2 ${pawnToLastSquarePosi.piece==="P" ? "border-white bg-gray-700" : "border-black bg-slate-400"} p-2 lg:p-3 rounded-md`} onClick={()=>{pawnToLastSquarePosi.piece==="P" ? handlePawnToLastSquare("R") : handlePawnToLastSquare("r")}}>{pawnToLastSquarePosi.piece==="P" ? <ChessPiece col="R"/> : <ChessPiece col="r"/>}</div>
                                <div className={`border-2 ${pawnToLastSquarePosi.piece==="P" ? "border-white bg-gray-700" : "border-black bg-slate-400"} p-2 lg:p-3 rounded-md`} onClick={()=>{pawnToLastSquarePosi.piece==="P" ? handlePawnToLastSquare("N") : handlePawnToLastSquare("n")}}>{pawnToLastSquarePosi.piece==="P" ? <ChessPiece col="N"/> : <ChessPiece col="n"/>}</div>
                                <div className={`border-2 ${pawnToLastSquarePosi.piece==="P" ? "border-white bg-gray-700" : "border-black bg-slate-400"} p-2 lg:p-3 rounded-md`} onClick={()=>{pawnToLastSquarePosi.piece==="P" ? handlePawnToLastSquare("B") : handlePawnToLastSquare("b")}}>{pawnToLastSquarePosi.piece==="P" ? <ChessPiece col="B"/> : <ChessPiece col="b"/>}</div>
                            </div>
                        </div>
                    </div> : (topPlayerChoosePrev || botPlayerChoosePrev) ?
                    <div className={`absolute inset-0 flex flex-col font-anticDidone bg-white justify-center items-center bg-opacity-60 gap-4 z-80 ${botPlayerChoosePrev ? "transform scale-x-[-1] scale-y-[-1]" : ""}`}>
                        <div className="bg-white p-4 rounded-lg">
                            <div className="text-blue-500 font-bold text-sm md:text-lg lg:text-xl">YOUR OPPONENT WANTS TO UNDO THE MOVE</div>
                            <div className="flex justify-center items-center gap-4">
                                <button className="border-2 border-green-600 bg-white md:text-lg lg:text-xl rounded-md p-1" onClick={()=>handlePlayerChoosePrev(true,((pieceColour===1 && topPlayerChoosePrev) || (pieceColour===0 && botPlayerChoosePrev)) ? "b" : "w")}>YES</button>
                                <button className="border-2 border-red-600 bg-white md:text-lg lg:text-xl rounded-md p-1" onClick={()=>handlePlayerChoosePrev(false,((pieceColour===1 && topPlayerChoosePrev) || (pieceColour===0 && botPlayerChoosePrev)) ? "b" : "w")}>NO</button>
                            </div>
                        </div>
                    </div> : ""
                    }
                    <div>
                        {board.map((row,i)=>(
                            <div key={i} className="flex justify-center">
                                {row.map((col,j)=>(
                                    <div key={i+""+j} className={`${(i+j)%2==0 ? "bg-gray-400" : "bg-blue-500"}`}>
                                    <div key={i+""+j} className={`${(isSelected && selectedPiece.row===i && selectedPiece.col===j) ? "bg-blue-800" : (isSelected && possibleMovesForSelectedPiece.some(move => move.row===i && move.col===j)) ? `border-2 md:border-4 p-4 box-border rounded-full border-blue-800 ${(i+j)%2==0 ? "bg-gray-400" : "bg-blue-500"}` : (i+j)%2==0 ? "bg-gray-400" : "bg-blue-500"} flex h-9 w-9 pt-1.5 md:pt-2 lg:pt-2.5 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 xxl:h-16 xxl:w-16 justify-center relative`}
                                        onClick={()=>handleSelectedPiece(col,i,j)}
                                    >
                                        {j === 0 && (
                                            <div className="absolute top-0 left-0.5 lg:left-1 text-xxs lg:text-xs">{pieceColour===1 ? 8 - i : i + 1}</div>
                                        )}
                                        <ChessPiece col={col} />
                                        {i === 7 && (
                                            <div className="absolute bottom-0 right-0.5 lg:right-1 text-xxs lg:text-xs">{pieceColour===1 ? String.fromCharCode(97 + j) : String.fromCharCode(104 - j)}</div>
                                        )}
                                    </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center items-center gap-3 ml-[48%] md:ml-[22%] mt-1">
                    {(JSON.stringify(previousBoardPosi[0])!==JSON.stringify([]) && JSON.stringify(previousBoardPosi[1])!==JSON.stringify([])) ? <div className="border-2 border-blue-500 rounded-md bg-white"><MdSkipPrevious color="#3b82f6" size={30} onClick={()=>setBotPlayerChoosePrev(true)}/></div> : <div className="w-8"></div>}
                    <div key="sw-2" className={`${pieceColour===1 ? `${moves%2===0 ? "bg-white" : "bg-slate-500"} text-black` : "bg-black text-white"} flex justify-center items-center border-2 border-blue-500 font-bold font-technology text-base md:text-xl p-1 rounded-md gap-2`}>
                        <div className="w-5">{moves%2===0 ? <FaStopwatch color={`${pieceColour===1 ? "black" : "white"}`} /> : ""}</div>
                        <div className="">{(Math.floor(time/60)===0) ? `00 : 00:${time}` : 
                        (Math.floor(time/3600)===0) ? `00 : ${time/60<10 ? `0${time/60}` :time/60} : ${time%60<10 ? `0${time%60}` : time%60}`
                        : `0${Math.floor(time/3600)} : ${(Math.floor(time/60)%60)<10 ? `0${(Math.floor(time/60)%60)}` : (Math.floor(time/60)%60)} : ${time%60<10 ? `0${time%60}` : time%60}`}</div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default GamePage