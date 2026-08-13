const { ObjectId } = require('mongodb')

class AggregatorService {
    static AggregatorMap = {
        customerList: {
            $lookup: {
                from: 'Customers',
                let: { customer: { $toObjectId: '$customer' } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$customer'] },
                        },
                    },
                ],
                as: 'customers',
            },
        },
        customerData: [
            {
                $lookup: {
                    from: 'Customers',
                    let: { customer: { $toObjectId: '$customer' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$customer'] },
                            },
                        },
                    ],
                    as: 'customer',
                },
            },
            {
                $addFields: {
                    customer: { $arrayElemAt: ['$customer', 0] },
                },
            },
        ],
        creator: [
            {
                $lookup: {
                    from: 'Users',
                    let: { createdBy: '$createdBy' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$uid', '$$createdBy'] },
                            },
                        },
                    ],
                    as: 'creator',
                },
            },
            {
                $addFields: {
                    creator: { $arrayElemAt: ['$creator.username', 0] },
                },
            },
        ],
        username: [
            {
                $lookup: {
                    from: 'Users',
                    let: { uid: '$uid' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$uid', '$$uid'] },
                            },
                        },
                    ],
                    as: 'username',
                },
            },
            {
                $addFields: {
                    username: { $arrayElemAt: ['$username.username', 0] },
                },
            },
        ],
        customerName: [
            {
                $lookup: {
                    from: 'Customers',
                    let: { customer: { $toObjectId: '$customer' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$customer'] },
                            },
                        },
                    ],
                    as: 'customer',
                },
            },
            {
                $addFields: {
                    customer: { $arrayElemAt: ['$customer.name', 0] },
                },
            },
        ],
        categoryName: [
            {
                $lookup: {
                    from: 'CategoriesV2',
                    let: { categoryID: { $toObjectId: '$categoryID' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$categoryID'] },
                            },
                        },
                    ],
                    as: 'category',
                },
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$category.name', 0] },
                },
            },
        ],
    };

    static createPipeline(filters) {
        console.log('Filters : ', filters);
        const pipeline = [];

        if (filters.filters && filters.filters.id) {
            console.log('filters.filters.id : ', filters.filters.id)
            pipeline.push({
                $match: {
                    _id: new ObjectId(filters.filters.id)
                },
            });
        }

        pipeline.push({
            $sort: filters.sort || { createdAt: -1 },
        });
        if (filters.lookupField && AggregatorService.AggregatorMap[filters.lookupField]) {
            const stages = AggregatorService.AggregatorMap[filters.lookupField];
            if (Array.isArray(stages)) {
                pipeline.push(...stages);
            } else {
                pipeline.push(stages);
            }
        }
        if (filters.filters && Object.keys(filters.filters).length > 0) {
            const { id, ...restFilters } = filters.filters;
            if (Object.keys(restFilters).length > 0) {
                pipeline.push({
                    $match: restFilters,
                });
            }
        }
        if (filters.pagination) {
            const { skip, limit } = filters.pagination;
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
        }

        console.log('pipeline : ', pipeline)

        return pipeline;
    }


    static getRequestLogs(method) {
        const pipeline = [
            {
                $match: method ? { method } : {}
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 100
            }
        ];
        return pipeline
    }

    static getUsersList(query, searchQuery) {
        let { page = 1, limit = 100 } = query;
        page = Math.max(parseInt(page, 10) || 1, 1);
        limit = Math.max(parseInt(limit, 10) || 100, 1);
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $match: {
                    $or: [
                        { username: { $regex: searchQuery, $options: 'i' } }, // Match by username
                        { email: { $regex: searchQuery, $options: 'i' } } // Match by email
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    password: 0,
                    authToken: 0,
                    __v: 0
                }
            }
        ];

        return pipeline;
    }

    static getPaginationData(query) {
        let { page = 1, limit = 100 } = query;
        page = Math.max(parseInt(page, 10) || 1, 1);
        limit = Math.max(parseInt(limit, 10) || 100, 1);
        return { page, limit };
    }

}

module.exports = AggregatorService;
