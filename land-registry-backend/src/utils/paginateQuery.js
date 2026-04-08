/**
 * Mongoose query paginator.
 *
 * @param {Query} query - Mongoose query object
 * @param {Object} options - { page, limit, sort }
 * @returns {{ data, pagination }} - Paginated result with metadata
 */
module.exports = async (query, options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20));
  const sort = options.sort || { createdAt: -1 };

  const total = await query.model.countDocuments(query.getFilter());
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const data = await query
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};
