const LIMIT_PER_PAGE = 3;

const SKIP = page => Number(LIMIT_PER_PAGE) * (Number(page) - Number(1));

module.exports.LIMIT_PER_PAGE = LIMIT_PER_PAGE;
module.exports.SKIP = SKIP;