
import { v4 as uuidv4 } from 'uuid';
import { EventService } from '../model/EventService';
import { Evento } from '../model/Event';
import { EventView } from '../view/EventView';

export class EventController {
  private eventos: Evento[] = [];

  async iniciar() {
    this.eventos = await EventService.carregarEventos();
    let sair = false;

    while (!sair) {
      const opcao = await EventView.mostrarMenu();

      switch (opcao) {
        case 'Adicionar Novo Evento':
          await this.adicionarEvento();
          break;
        case 'Listar Todos os Eventos':
          EventView.listarEventos(this.eventos);
          break;
        case 'Buscar Eventos':
          await this.buscarEventos();
          break;
        case 'Atualizar Evento':
          await this.atualizarEvento();
          break;
        case 'Cancelar Evento':
          await this.cancelarEvento();
          break;
        case 'Registrar Participante':
          await this.registrarParticipante();
          break;
        case 'Sair':
          sair = true;
          await EventService.salvarEventos(this.eventos);
          break;
      }
    }
  }

  private async adicionarEvento() {
    const dados = await EventView.coletarDadosEvento();
    const existe = this.eventos.find(e =>
      e.nome.toLowerCase() === dados.nome.toLowerCase() &&
      e.data === dados.data
    );

    if (existe) {
      EventView.mostrarMensagem('Erro: Evento com o mesmo nome e data já existe.');
      return;
    }

    const novoEvento: Evento = {
      id: uuidv4(),
      nome: dados.nome,
      data: dados.data,
      local: dados.local,
      capacidadeMaxima: dados.capacidadeMaxima,
      participantesAtuais: 0,
      status: 'agendado'
    };

    this.eventos.push(novoEvento);
    await EventService.salvarEventos(this.eventos);
    EventView.mostrarMensagem('Evento adicionado com sucesso!');
  }

  private async buscarEventos() {
    const termo = (await EventView.buscarPorNomeOuLocal()).toLowerCase();
    const encontrados = this.eventos.filter(e =>
      e.nome.toLowerCase().includes(termo) || e.local.toLowerCase().includes(termo)
    );
    EventView.listarEventos(encontrados);
  }

  private async atualizarEvento() {
    const id = await EventView.solicitarId();
    const evento = this.eventos.find(e => e.id === id);

    if (!evento) return EventView.mostrarMensagem('Evento não encontrado.');

    const novosDados = await EventView.coletarDadosEvento();
    evento.nome = novosDados.nome;
    evento.data = novosDados.data;
    evento.local = novosDados.local;
    evento.capacidadeMaxima = novosDados.capacidadeMaxima;

    await EventService.salvarEventos(this.eventos);
    EventView.mostrarMensagem('Evento atualizado com sucesso.');
  }

  private async cancelarEvento() {
    const id = await EventView.solicitarId();
    const evento = this.eventos.find(e => e.id === id);

    if (!evento) return EventView.mostrarMensagem('Evento não encontrado.');

    evento.status = 'cancelado';
    await EventService.salvarEventos(this.eventos);
    EventView.mostrarMensagem('Evento cancelado com sucesso.');
  }

  private async registrarParticipante() {
    const id = await EventView.solicitarId();
    const evento = this.eventos.find(e => e.id === id);

    if (!evento) return EventView.mostrarMensagem('Evento não encontrado.');

    if (evento.status !== 'agendado') {
      return EventView.mostrarMensagem('Não é possível registrar participantes em eventos não agendados.');
    }

    if (evento.participantesAtuais >= evento.capacidadeMaxima) {
      return EventView.mostrarMensagem('Capacidade máxima atingida.');
    }

    evento.participantesAtuais += 1;
    await EventService.salvarEventos(this.eventos);
    EventView.mostrarMensagem('Participante registrado com sucesso.');
  }
}
