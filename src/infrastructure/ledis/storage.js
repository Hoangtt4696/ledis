class Storage {
  constructor(storage, ttlManager) {
    this.storage = storage || {};
    this.ttlManager = ttlManager || {};
  }
};

export default Storage;
