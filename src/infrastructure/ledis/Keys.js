import util from 'utils/util';
import fs from 'fs';
import config from '../../config';
import Storage from './storage';

class Keys extends Storage {
  constructor(storage, ttlManager) {
    super(storage, ttlManager);
  }

  get commandKeys() {
    return ['keys', 'del', 'flushdb', 'expire', 'ttl', 'save', 'restore'];
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

  async save() {
    if (arguments.length !== 0) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'save'));
    }

    const snapshortDir = `${process.cwd()}/storage/snapshots`;
    const isDirExisted = await fs.existsSync(snapshortDir);

    if (!isDirExisted) {
      await fs.mkdirSync(snapshortDir, { recursive: true });
    }

    const fileName = `${Date.now()}`;
    const filePath = `${snapshortDir}/${fileName}.txt`;

    await fs.writeFileSync(filePath, JSON.stringify(this.storage, (key, val) => {
      if (val instanceof Set) {
        return { isSet: true, values: [...val] };
      }

      return val;
    }));

    return config.messages.OK;
  }

  async restore() {
    if (arguments.length !== 0) {
      throw new Error(util.getMessage(config.messages.WRONG_ARGUMENTS, 'save'));
    }

    const snapshortDir = `${process.cwd()}/storage/snapshots`;
    const isDirExisted = await fs.existsSync(snapshortDir);

    if (!isDirExisted) {
      await fs.mkdirSync(snapshortDir, { recursive: true });
    }

    const files = await fs.readdirSync(snapshortDir);

    if (files.length > 0) {
      const data = await fs.readFileSync(`${snapshortDir}/${files[files.length - 1]}`);

      if (data) {
        const dataStorage = JSON.parse(data.toString(), (key, val) => {
          if (val && val.isSet) {
            return new Set(val.values);
          }

          return val;
        });

        this.flushdb();

        Object.keys(dataStorage).forEach(key => {
          this.storage[key] = dataStorage[key];
        });
      }
    }

    return config.messages.OK;
  }
}

export default Keys;