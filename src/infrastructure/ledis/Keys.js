import util from 'utils/util';
import config from '../../config';
import Storage from './storage';

class Keys extends Storage {
  constructor(storage, ttlManager) {
    super(storage, ttlManager);
  }

  get commandKeys() {
    return ['keys', 'del', 'flushdb', 'expire', 'ttl'];
  }

  // follow assignment: get all keys
  keys() {
    if (arguments.length !== 0) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'keys'));
    }

    const result = Object.keys(this.storage);

    return result.length === 0 ? config.messages.EMPTY_LIST : result;
  }

    // follow assignment: del a key
  del(key) {
    if (arguments.length !== 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'del'));
    }

    const hasValue = this.storage[key];

    delete this.storage[key];

    return util.getMessage(config.messages.INTEGER, +(!!hasValue));
  }

  flushdb() {
    if (arguments.length !== 0) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'flushdb'));
    }

    Object.keys(this.storage).forEach(key => {
      delete this.storage[key];
    });

    return config.messages.OK;
  }

  expire(key, seconds) {
    if (arguments.length !== 2) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'expire'));
    }

    const secondsNum = parseInt(seconds, 10);

    if (!Number.isInteger(secondsNum) || secondsNum < 0) {
      throw new Error(config.messages.REQUIRE_INTEGER);
    }

    if (this.ttlManager[key]) {
      return util.getMessage(config.messages.INTEGER, this.ttlManager[key].seconds);
    }

    const value = this.storage[key];

    if (!value) {
      return util.getMessage(config.messages.INTEGER, 0);
    }

    this.ttlManager[key] = {
      start: Date.now(),
      seconds: secondsNum,
    };

    setTimeout(() => {
      delete this.storage[key];
      delete this.ttlManager[key];
    }, secondsNum * 1000);

    return util.getMessage(config.messages.INTEGER, secondsNum)
  }

  ttl(key) {
    if (arguments.length !== 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'ttl'));
    }

    const value = this.storage[key];

    if (!value) {
      return util.getMessage(config.messages.INTEGER, -2);
    }

    if (!this.ttlManager[key]) {
      return util.getMessage(config.messages.INTEGER, -1);
    }

    const { start, seconds } = this.ttlManager[key];
    const remaining = Math.round(seconds - (Date.now() - start) / 1000);

    return util.getMessage(config.messages.INTEGER, remaining)
  }
}

export default Keys;
