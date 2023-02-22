function renameDuplicates(names) {
    const count = {};
    return names.map((name) => {
      if (!count[name]) {
        count[name] = 1;
        return name;
      }
      const newName = `${name}_${count[name]}`;
      count[name]++;
      return newName;
    });
  }

  module.exports = {
    renameDuplicates
  }