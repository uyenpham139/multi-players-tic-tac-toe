import Square from "./Square";

interface BoardProps {
  squares: (number)[],
  handleClick: (index: number) => void,
}

export default function Board({ squares, handleClick }: BoardProps) {
  const size = Math.sqrt(squares.length);
  const rows = Array.from({ length: size }, (_, i) => 
    squares.slice(i * size, i * size + size)
  ) ;
  
  return(
    <div className="board">
      {rows.map((row, rowIndex) => (
        <div className="boardRow" key={rowIndex}>
          {row.map((square, colIndex) => {
            const index = rowIndex * size + colIndex;
            return (
              <Square 
                key={index}
                value={square}
                handleClick={() => handleClick(index)}
              />
            )
          })}
        </div>
      ))}
    </div>
  );
}