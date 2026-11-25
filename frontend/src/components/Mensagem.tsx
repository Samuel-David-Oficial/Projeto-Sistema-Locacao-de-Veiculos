import type { Feedback } from "../types/Feedback";

interface MensagemProps {
  feedback: Feedback | null;
}

function Mensagem({ feedback }: MensagemProps) {
  if (!feedback) return null;

  return (
    <div className={`mensagem ${feedback.tipo}`} role="alert">
      {feedback.texto}
    </div>
  );
}

export default Mensagem;
