/* eslint-disable prefer-regex-literals */
// services/JoiSchemaService.js

const Joi = require('joi');

class JoiSchemaService {
    static email = Joi.string().email().lowercase().required();
    static password = Joi.string()
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{6,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 6 characters, one letter, and one number'
        });

    static phone = Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
        'string.pattern.base': 'Phone number must be in E.164 format (e.g., +123456789)'
    });

    static uidSchema = Joi.object({
        uid: Joi.string().required().messages({
            'string.empty': 'UID is required.',
            'any.required': 'UID is required.'
        })
    });

    static setPremiumDataSchemaForProteinTracker = Joi.object({
        uid: Joi.string().required(),
        planName: Joi.string().valid(
            'lifetime_premium',
            'annual_premium',
            'monthly_base',
            'monthly_premium',
            'lifetime',
            'annual_plan',
            'monthly_plan',
            'weekly_plan',
            'lifetime_premium_developing',
            'weekly_premium_developing',
            'weekly_premium',
            'monthly_premium_developing',
            'annual_premium_developing',
            'annual_plan_reduced',
            'annual_intro_developing',
            '500_coins'
        ).required(),
        orderID: Joi.string().required(),
        purchaseToken: Joi.string().required(),
    })

    static dateISO = Joi.date().iso();
    static dateCustom = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).messages({
        'string.pattern.base': 'Date must be in DD-MM-YYYY format'
    });

    static url = Joi.string().uri();
    static imageUrl = Joi.string().uri().regex(/\.(jpeg|jpg|gif|png)$/).messages({
        'string.pattern.base': 'URL must end with .jpeg, .jpg, .gif, or .png'
    });

    static integer = Joi.number().integer();
    static positiveInteger = Joi.number().integer().positive();
    static negativeInteger = Joi.number().integer().negative();
    static float = Joi.number();
    static positiveFloat = Joi.number().positive();
    static negativeFloat = Joi.number().negative();
    static arrayString = Joi.array().items(Joi.string());
    static arrayInteger = Joi.array().items(Joi.number().integer());
    static ipAddress = Joi.string().ip();
    static ipv4Address = Joi.string().ip({ version: ['ipv4'] });
    static ipv6Address = Joi.string().ip({ version: ['ipv6'] });
    static hexColor = Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).messages({
        'string.pattern.base': 'Must be a valid hex color code'
    });

    static uuid = Joi.string().guid({ version: ['uuidv4', 'uuidv5'] });
    static mongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
        'string.pattern.base': 'Must be a valid MongoDB ObjectId'
    });

    static jwt = Joi.string().pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/).messages({
        'string.pattern.base': 'Must be a valid JWT token'
    });

    static creditCard = Joi.string().creditCard();
    static postalCodeUS = Joi.string().pattern(/^\d{5}(-\d{4})?$/).messages({
        'string.pattern.base': 'Must be a valid US postal code'
    });

    static postalCodeCA = Joi.string().pattern(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/).messages({
        'string.pattern.base': 'Must be a valid Canadian postal code'
    });

    static currency = Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY');
    static time24h = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
        'string.pattern.base': 'Time must be in HH:mm format'
    });

    static longitude = Joi.number().min(-180).max(180);
    static latitude = Joi.number().min(-90).max(90);
    static boolean = Joi.boolean();
    static age = Joi.number().integer().min(0).max(120).messages({
        'number.base': 'Age must be a number',
        'number.min': 'Age cannot be negative',
        'number.max': 'Age cannot exceed 120'
    });

    static firstName = Joi.string().min(1).max(50).regex(/^[a-zA-Z]+$/).messages({
        'string.pattern.base': 'First name must contain only letters'
    });

    static lastName = Joi.string().min(1).max(50).regex(/^[a-zA-Z]+$/).messages({
        'string.pattern.base': 'Last name must contain only letters'
    });

    static countryCode = Joi.string().length(2).regex(/^[A-Z]{2}$/).messages({
        'string.pattern.base': 'Country code must be two uppercase letters'
    });

    // Reusable Enums
    static userRoles = Joi.string().valid('admin', 'user', 'moderator');
    static categories = Joi.string().valid('electronics', 'clothing', 'home', 'beauty', 'sports');

    static setUserSchema = Joi.object({
        uid: Joi.string().required().messages({
            'string.empty': 'UID is required.',
            'any.required': 'UID is required.'
        }),
        platform: Joi.string().valid('android', 'ios').required().messages({
            'string.empty': 'Platform is required.',
            'any.required': 'Platform is required.',
            'any.only': 'Platform must be either "android" or "ios".'
        }),
        pushToken: Joi.string().allow('', null),
        appVersion: Joi.string().allow('', null),
        source: Joi.string().allow('', null),
        country: Joi.string().allow('', null),
        currency: Joi.string().allow('', null),
        language: Joi.string().allow('', null),
        device: Joi.string().allow('', null),
        osVersion: Joi.string().allow('', null),
    }).unknown(true);

    // Example Schemas
    static userRegistrationSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: this.email,
        password: this.password,
        phone: this.phone,
        role: this.userRoles.required()
    });

    static productCreationSchema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500),
        price: this.positiveFloat.required(),
        category: this.categories,
        inStock: Joi.boolean().default(true),
        releaseDate: this.dateISO.optional()
    });

    static signupSchema = Joi.object({
        email: this.email,
        password: this.password
    })

    static linkAccountSchema = Joi.object({
        uid: Joi.string().required().messages({
            'string.empty': 'UID is required.',
            'any.required': 'UID is required.'
        }),
        email: this.email,
        password: this.password
    })

    static signupSchemaV2 = Joi.object({
        email: this.email,
        password: this.password,
        name: Joi.string().min(3).max(100).optional(), // name is optional, but if provided, must be between 3 and 100 characters
        address: Joi.string().allow('', null).optional() // address is optional and can be an empty string or null
    });

    static sendBulkMails = Joi.object({
        subject: Joi.string().required().messages({
            'string.empty': 'Subject is required'
        }),
        body: Joi.string().required().messages({
            'string.empty': 'Body is required'
        }),
        recipients: Joi.alternatives().try(
            Joi.string().valid('ALL_USERS'),
            Joi.array().items(Joi.string().email()).min(1)
        ).required().messages({
            'any.required': 'Recipients are required',
            'array.min': 'At least one recipient is required'
        })
    })

    static validateNameDescriptionImage = Joi.object({
        name: Joi.string().required().messages({
            'string.base': 'Name must be a string',
            'any.required': 'Name is required'
        }),
        description: Joi.string().required().messages({
            'string.base': 'Description must be a string',
            'any.required': 'Description is required'
        }),
        imageURL: Joi.string().required().messages({
            'string.base': 'imageURL must be a string',
            'any.required': 'imageURL is required'
        })
    })

    static addCategoriesV2Schema = Joi.object({
        name: Joi.string().required().messages({ 'any.required': 'name is required' }),
        expiresAt: Joi.number().required().messages({ 'any.required': 'expiresAt is required' }),
        description: Joi.string().required().messages({ 'any.required': 'description is required' }),
        isActive: Joi.boolean().required().messages({ 'any.required': 'isActive is required' }),
        type: Joi.string().required().messages({ 'any.required': 'type is required' })
    });

    static factsSchema = Joi.object({
        fact: Joi.string().required().messages({ 'any.required': 'fact is required' }),
        categoryID: Joi.string().required().messages({ 'any.required': 'categoryID is required' })
    });

    static openAIQuerySchema = Joi.object({
        query: Joi.string().min(2).required(),
        uid: Joi.string().required()
    })

    // Validation Function
    static validate(data, schema) {
        const { error, value } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return { isValid: false, errors: errorMessages };
        }
        return { isValid: true, value };
    }
}

// Usage
// const { isValid, errors, value } = JoiSchemaService.validate(req.query, JoiSchemaService.paginationSchema);

module.exports = JoiSchemaService;
