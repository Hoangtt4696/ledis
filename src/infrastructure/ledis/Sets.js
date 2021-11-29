import util from 'utils/util';
import config from '../../config';
import Storage from './storage';

class Sets extends Storage {
  constructor(storage, ttlManager) {
    super(storage, ttlManager);
  }

  get commandKeys() {
    return ['sadd', 'scard', 'smembers', 'srem', 'sinter'];
  }

  sadd(key, ...values) {
    if (arguments.length < 2) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'sadd'));
    }

    if (this.storage[key] && !(this.storage[key] instanceof Set)) {
      throw new Error(util.getMessage(config.messages.WRONG_TYPE));
    }

    const value = this.storage[key] || new Set();

    let totalAdded = 0;
    values.forEach(val => {
      if (!value.has(val)) {
        value.add(val);

        totalAdded++;
      }
    });

    this.storage[key] = value;

    return util.getMessage(config.messages.INTEGER, totalAdded);
  }

  scard(key) {
    if (arguments.length !== 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'scard'));
    }

    const value = this.storage[key];

    if (value === undefined) {
      return util.getMessage(config.messages.INTEGER, 0);
    }

    if (!(value instanceof Set)) {
      throw new Error(util.getMessage(config.messages.WRONG_TYPE));
    }

    return util.getMessage(config.messages.INTEGER, value.size);
  }

  smembers(key) {
    if (arguments.length !== 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'smembers'));
    }

    const value = this.storage[key];

    if (value === undefined) {
      return config.messages.EMPTY_LIST;
    }

    if (!(value instanceof Set)) {
      throw new Error(util.getMessage(config.messages.WRONG_TYPE));
    }

    return [...value];
  }

  srem(key, ...values) {
    if (arguments.length < 2) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'srem'));
    }

    const value = this.storage[key];

    if (value === undefined) {
      return util.getMessage(config.messages.INTEGER, 0);
    }

    if (!(value instanceof Set)) {
      throw new Error(util.getMessage(config.messages.WRONG_TYPE));
    }

    let totalRemoved = 0;

    values.forEach(val => {
      const isRemoved = value.delete(val);

      if (isRemoved) {
        totalRemoved++;
      }
    });

    return util.getMessage(config.messages.INTEGER, totalRemoved);
  }

  sinter(...keys) {
    if (arguments.length < 1) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'sinter'));
    }

    let [isWrongType, hasEmpty] = [false, false];

    for (const key of keys) {
      const value = this.storage[key];

      if (!value) {
        hasEmpty = true;
      } else if (!(value instanceof Set)) {
        isWrongType = true;
      }
    }

    if (isWrongType) {
      throw new Error(util.getMessage(config.messages.WRONG_TYPE));
    }

    if (hasEmpty) {
      return config.messages.EMPTY_LIST;
    }

    const result = keys.reduce(
      (res, key) => res.filter((elm) => this.storage[key].has(elm)),
      [...this.storage[keys[0]]],
    );

    if (result.length === 0) {
      return config.messages.EMPTY_LIST;
    }

    return result;
  }
}

export default Sets;
