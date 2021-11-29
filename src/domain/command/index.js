import cmdUtil from 'utils/cmd';
import util from 'utils/util';
import Ledis from 'infrastructure/ledis';
import config from '../../config';

class Command {
  validateCmd(cmd) {

  }

  async execCommand(inputStr) {
    if (typeof inputStr !== 'string') {
      throw new Error(util.getMessage(config.messages.WRONG_COMMAND));
    }

    const { cmd, args } = cmdUtil.parseArgs(inputStr);
    const cmdList = Object.keys(config.cmdConfig);

    if (!cmd || !cmdList.includes(cmd)) {
      throw new Error(util.getMessage(config.messages.WRONG_COMMAND_SPECIFIC, cmd, args.join(', ')));
    }

    return Ledis.run(cmd, args);
  }
}

export default new Command();
