import Square from "./Square";

interface BoardProps {
  squares: (string|null)[],
  handleClick: (index: number) => void,
}

export default function Board({ squares, handleClick }: BoardProps) {
  const squareComponents = squares.map((square, index) => (<Square handleClick={() => handleClick(index)} value={square}/>))
  
  return(
    <div className="board">
      <div className="boardRow">
        {squareComponents.slice(0,3)}
      </div>
      <div className="boardRow">
        {squareComponents.slice(3,6)}
      </div>
      <div className="boardRow">
        {squareComponents.slice(6)}
      </div>
    </div>
  );
}