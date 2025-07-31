
import { EventController } from './controller/EventController';

(async () => {
  const controller = new EventController();
  await controller.iniciar();
})();
