export type EventoStatus = 'agendado' | 'cancelado' | 'concluido';

export interface Evento {
  id: string;
  nome: string;
  data: string; 
  local: string;
  capacidadeMaxima: number;
  participantesAtuais: number;
  status: EventoStatus;
}
