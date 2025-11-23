// validators/searchValidator.js
const { body, query, validationResult } = require('express-validator')

const searchValidationRules = () => {
    return [
        query('query')
            .optional()
            .isLength({ min: 1, max: 100 })
            .withMessage('Search query must be between 1 and 100 characters')
            .trim()
            .escape(),
        
        query('category')
            .optional()
            .isUUID()
            .withMessage('Invalid category ID'),
        query('minPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Min price must be a positive number'),
        
        query('maxPrice')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Max price must be a positive number'),
        
        query('sortBy')
            .optional()
            .isIn(['name', 'price', 'createdAt', ''])
            .withMessage('Invalid sort field'),
        
        query('sortOrder')
            .optional()
            .isIn(['asc', 'desc', ''])
            .withMessage('Sort order must be asc or desc')
    ]
}

const validateSearch = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        })
    }
    next()
}

module.exports = {
    searchValidationRules,
    validateSearch
}