import inquirer from 'inquirer';

export class EventView {
  static async mostrarMenu(): Promise<string> {
    const { opcao } = await inquirer.prompt([
      {
        type: 'list',
        name: 'opcao',
        message: 'Escolha uma opção:',
        choices: [
          'Adicionar Novo Evento',
          'Listar Todos os Eventos',
          'Buscar Eventos',
          'Atualizar Evento',
          'Cancelar Evento',
          'Registrar Participante',
          'Sair'
        ]
      }
    ]);
    return opcao;
  }

  static async coletarDadosEvento(): Promise<any> {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'nome',
        message: 'Nome do evento:',
        validate: input => input.trim() !== '' || 'Nome é obrigatório.'
      },
      {
        type: 'input',
        name: 'data',
        message: 'Data (YYYY-MM-DD):',
        validate: input => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Formato inválido.'
      },
      {
        type: 'input',
        name: 'local',
        message: 'Local:',
        validate: input => input.trim() !== '' || 'Local é obrigatório.'
      },
      {
        type: 'number',
        name: 'capacidadeMaxima',
        message: 'Capacidade máxima:',
        validate: input => input > 0 || 'Capacidade deve ser maior que 0.'
      }
    ]);
  }

  static async solicitarId(): Promise<string> {
    const { id } = await inquirer.prompt({
      type: 'input',
      name: 'id',
      message: 'Informe o ID do evento:',
    });
    return id;
  }

  static mostrarMensagem(mensagem: string): void {
    console.log('\n' + mensagem + '\n');
  }

  static listarEventos(eventos: any[]): void {
    eventos.forEach(ev => {
      console.log(`ID: ${ev.id}
Nome: ${ev.nome}
Data: ${ev.data}
Local: ${ev.local}
Capacidade: ${ev.capacidadeMaxima}
Participantes: ${ev.participantesAtuais}
Status: ${ev.status}\n`);
    });
  }

  static async buscarPorNomeOuLocal(): Promise<string> {
    const { termo } = await inquirer.prompt({
      type: 'input',
      name: 'termo',
      message: 'Digite o nome ou local para buscar:'
    });
    return termo;
  }
}
