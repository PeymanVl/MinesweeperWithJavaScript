// Logic

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    MARKED: "marked",
    NUMBER: "number"
}
export function createBoard(boardsize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardsize, numberOfMines)
    for (let x = 0; x < boardsize; x++) {
        const row = []
        for (let y = 0; y < boardsize; y++) {
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                },

            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}
export function markTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN &&
        tile.status !== TILE_STATUSES.MARKED) {
        return
    }
    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN
    } else {
        tile.status = TILE_STATUSES.MARKED
    }
}
function getMinePositions(boardSize, numberOfMines) {
    const positions = []
    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }
        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
    }

    return positions
}
export function revealTile(board,tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
         return
    }
    if(tile.mine){
        tile.status=TILE_STATUSES.MINE
        return
    }
    tile.status=TILE_STATUSES.NUMBER
    const adjacentTile=nearbyTiles(board,tile)
    const mines=adjacentTile.filter(t=>t.mine)
    if(mines.length===0){
        adjacentTile.forEach(revealTile.bind(null,board))
    }else {
        tile.element.textContent=mines.length
    }
}

export function checkWin(board){
    return board.every(row => {
        return row.every ( tile =>{
            return tile.status === TILE_STATUSES.NUMBER || (tile.mine && ( tile .status ===TILE_STATUSES.HIDDEN 
                || tile.status === TILE_STATUSES.MARKED))
        })
    })
}

export function checkLose(board){
    return board.some(row => {
        return row.some (tile => tile.status === TILE_STATUSES.MINE)
    })
}
function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}
function randomNumber(size) {
    return Math.floor(Math.random() * size)
}
function nearbyTiles (board,{x,y}){
    const tiles=[]

    for(let xoffset = -1 ; xoffset <= 1; xoffset ++){
        for(let yoffset = -1 ; yoffset <= 1; yoffset ++){
            const tile=board[x+ xoffset]?.[y+yoffset]
            if(tile)
            tiles.push(tile)
        }
    }
    return tiles
}