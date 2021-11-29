import util from 'utils/util';
import config from '../../config';
import Storage from './storage';

class Strings extends Storage {
  constructor(storage, ttlManager) {
    super(storage, ttlManager);
  }

  get commandKeys() {
    return ['get', 'set'];
  }

  get(key) {
    if (arguments.length !== 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'get'));
    }

    const value = this.storage[key];

    if (value && typeof value !== 'string') {
      throw new Error(config.messages.WRONG_TYPE);
    }

    return this.storage[key] || config.messages.NULL;
  }

  set(key, value) {
    if (arguments.length !== 2) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'set'));
    }

    this.storage[key] = value;

    return config.messages.OK;
  }
}

export default Strings;
