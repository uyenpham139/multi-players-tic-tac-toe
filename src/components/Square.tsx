interface SquareProps {
  value: string|null,
  handleClick: () => void,
}

export default function Square({ value, handleClick }: SquareProps) {
  return(
    <button className={`square ${value === "X" ? "x" : "o"}`} onClick={handleClick}>
      {value}
    </button>
  );
}