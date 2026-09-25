import { Router } from 'express';
import { InternalController } from '../controllers/internal.controller';

export const internalRouter: Router = Router();

internalRouter.post('/events/ingest', InternalController.processEvent);
