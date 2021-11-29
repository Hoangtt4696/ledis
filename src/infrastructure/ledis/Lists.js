import util from 'utils/util';
import config from '../../config';
import Storage from './storage';

class Lists extends Storage {
  constructor(storage, ttlManager) {
    super(storage, ttlManager);
  }

  get commandKeys() {
    return ['llen', 'rpush', 'lpop', 'rpop', 'lrange'];
  }

  llen(key) {
    if (arguments.length !== 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'llen'));
    }

    const value = this.storage[key];

    if (value && !Array.isArray(value)) {
      throw new Error(config.messages.WRONG_TYPE);
    }

    return value ? value.length : 0;
  }

  rpush(key, ...values) {
    if (arguments.length <= 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'rpush'));
    }

    const value = this.storage[key];

    if (value && !Array.isArray(value)) {
      throw new Error(config.messages.WRONG_TYPE);
    }

    this.storage[key] = value ? [...value, ...values] : values;

    return this.storage[key].length;
  }

  lpop(key, countSlice) {
    if (arguments.length === 0 || arguments.length > 2) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'lpop'));
    }

    const value = this.storage[key];

    if (value === undefined) {
      return config.messages.NULL;
    }

    if (!Array.isArray(value)) {
      throw new Error(config.messages.WRONG_TYPE);
    }

    if (countSlice !== undefined && ![0, 1].includes(Math.sign(countSlice))) {
      throw new Error(config.messages.REQUIRE_POSITIVE);
    }

    const result = value.splice(0, countSlice !== undefined ? countSlice : 1);
    
    if (value.length === 0) {
      delete this.storage[key];
    }

    return result.length === 1 ? result[0] : result;
  }

  rpop(key, countSlice) {
    if (arguments.length === 0 || arguments.length > 2) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'rpop'));
    }

    const value = this.storage[key];

    if (!value) {
      return config.messages.NULL;
    }

    if (!Array.isArray(value)) {
      throw new Error(config.messages.WRONG_TYPE);
    }

    if (countSlice !== undefined && ![0, 1].includes(Math.sign(countSlice))) {
      throw new Error(config.messages.REQUIRE_POSITIVE);
    }

    const count = countSlice !== undefined ? countSlice : 1;
    const result = value.splice(-Math.abs(count), count);
    
    if (value.length === 0) {
      delete this.storage[key];
    }

    return result.length === 1 ? result[0] : result.reverse();
  }

  lrange(key, start, end) {
    if (arguments.length !== 3) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'lrange'));
    }

    const [startSigned, endSigned] = [Math.sign(start), Math.sign(end)];

    if (startSigned === -1 || endSigned === -1) {
      throw new Error(config.messages.REQUIRE_POSITIVE);
    }

    if (isNaN(startSigned) || isNaN(endSigned)) {
      throw new Error(config.messages.REQUIRE_INTEGER);
    }

    const value = this.storage[key];

    if (value === undefined) {
      return config.messages.EMPTY_LIST;
    }

    if (!Array.isArray(value)) {
      throw new Error(config.messages.WRONG_TYPE);
    }

    const result = value.slice(start, parseInt(end) + 1);

    return result.length > 0 ? result : config.messages.EMPTY_LIST;
  }
}

export default Lists;
