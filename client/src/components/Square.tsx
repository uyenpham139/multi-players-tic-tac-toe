interface SquareProps {
  value: number,
  handleClick: () => void,
}

export default function Square({ value, handleClick }: SquareProps) {
  return(
    <button className={`square ${(value % 2 === 0) ? "odd" : "even"}`} onClick={handleClick}>
      {value}
    </button>
  );
}