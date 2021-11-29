const parseArgs = (cmdStr) => {
  if (!cmdStr) return { cmd: null, args: [] };

  let input = cmdStr.trim().split(/\s+/);

  input = input.filter(str => !!str);

  return {
    cmd: input[0] ? input[0].toLowerCase() : null,
    args: input.slice(1),
  };
};

export default {
  parseArgs,
};
