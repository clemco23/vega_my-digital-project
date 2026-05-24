const serializeForJson = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, currentValue) =>
      typeof currentValue === "bigint" ? currentValue.toString() : currentValue
    )
  );

module.exports = { serializeForJson };
