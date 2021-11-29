import util from 'utils/util';
import config from '../../config';
import Strings from './Strings';
import Lists from './Lists';
import Sets from './Sets';
import Keys from './Keys';

class Ledis {
  constructor() {
    this.storage = {};
    this.ttlManager = {};
    this.module = {
      strings: new Strings(this.storage),
      lists: new Lists(this.storage),
      sets: new Sets(this.storage),
      keys: new Keys(this.storage),
    }
  }

  getModule(cmdKey) {
    let moduleName = null;

    Object.keys(this.module).forEach(module => {
      const cmdKeys = this.module[module].commandKeys;

      if (cmdKeys.includes(cmdKey)) {
        moduleName = module;
      }
    });

    return this.module[moduleName];
  }

  run(cmd, args) {
    const instance = this.getModule(cmd);

    if (!instance || !instance[cmd]) {
      throw new Error(util.getMessage(config.messages.WRONG_COMMAND_SPECIFIC, cmd));
    }

    return instance[cmd].call(instance, ...args);
  }
}

export default new Ledis();
