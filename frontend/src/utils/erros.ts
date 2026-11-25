import { isAxiosError } from "axios";

export function extrairMensagem(erro: unknown): string {
  if (isAxiosError(erro)) {
    if (erro.response) {
      const dados = erro.response.data as { error?: string } | undefined;
      return dados?.error ?? "A API retornou um erro inesperado";
    }
    return "Não foi possível conectar à API. Verifique se o servidor está em execução.";
  }
  return "Ocorreu um erro inesperado";
}
