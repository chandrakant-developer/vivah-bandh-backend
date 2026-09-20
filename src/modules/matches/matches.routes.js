import express from 'express';

import { authenticate } from '../../middlewares/authenticate.middleware.js';

import { getRecommendedMatchesController } from './recommended/recommended.controller.js';
import { getNewMatchesController } from './new/new.controller.js';
import { createShortlistController } from './shortlisted/create/create.controller.js';
import { removeShortlistController } from './shortlisted/remove/remove.controller.js';
import { getShortlistsController } from './shortlisted/get/get.controller.js';

const router = express.Router();

router.get('/recommended', authenticate, getRecommendedMatchesController);
router.get('/new', authenticate, getNewMatchesController);
router.post('/shortlist/:candidateUserId', authenticate, createShortlistController);
router.delete('/shortlist/:candidateUserId', authenticate, removeShortlistController);
router.get('/shortlist', authenticate, getShortlistsController);

export default router;
