import CommandService from 'domain/command';
import resResponse from 'utils/handle-response';

class Command {
  async excuteCommand(req, res, next) {
    try {
      const { cmd } = req.body;
      const result = await CommandService.execCommand(cmd);

      res.send(resResponse(true, result));
    } catch (error) {
      res.send(resResponse(false, null, error.message));
    }
  }
}

export default new Command();
