const getMessage = (message, ...args) => {
  if (!message || !Array.isArray(args)) {
    return '';
  }

  return message.replace(/({\d})/g, (pattern) => {
    const paramOrder = pattern.replace(/{/, '').replace(/}/, '');
    const replace = args[parseInt(paramOrder, 10) - 1];

    return replace === undefined ? '' : replace;
  });
};

export default {
  getMessage,
};
