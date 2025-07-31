import fs from 'fs/promises';
import path from 'path';
import { Evento } from './Event';

const filePath = path.resolve(__dirname, '../database/events.json');

export class EventService {
  static async carregarEventos(): Promise<Evento[]> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as Evento[];
    } catch (err) {
      return [];
    }
  }

  static async salvarEventos(eventos: Evento[]): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(eventos, null, 2));
  }
}
