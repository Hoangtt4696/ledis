import { Router } from 'express';
import commandModule from 'modules/command';

const router = Router();

router.route('/')
  .get((req, res) => {
    res.render('index', { title: 'Ledis' })
  })
  .post(commandModule.excuteCommand);

export default router;
