interface CardProps {
  message: string;
  handleResetConfirm: (accept: boolean) => void;
}

export default function Cards({ message, handleResetConfirm }: CardProps) {
  return (
    <div className="cardOverlay">
      <div className="card">
        <p className="cardMessage">{message}</p>
        <div className="cardBtnGroup">
          <button
            className="cardBtn confirm"
            onClick={() => handleResetConfirm(true)}
          >
            Accept
          </button>
          <button
            className="cardBtn decline"
            onClick={() => handleResetConfirm(false)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
