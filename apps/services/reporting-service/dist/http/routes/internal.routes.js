import { Router } from 'express';
import { InternalController } from '../controllers/internal.controller';
export const internalRouter = Router();
internalRouter.post('/events/ingest', InternalController.processEvent);
