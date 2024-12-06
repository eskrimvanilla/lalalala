const MAX_FILE_SIZE = 1000000;

const validateFileSize = (size) => size <= MAX_FILE_SIZE;

module.exports = { validateFileSize };
