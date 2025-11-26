import express from 'express';
import {
    getAllExamples,
    getExampleById,
    createExample,
    triggerError,
    deleteExample,
} from '@/controllers/exampleController';

const router = express.Router();

/**
 * Example routes demonstrating different response types
 */
router
    .route('/')
    .get(getAllExamples)      // Get all examples
    .post(createExample);      // Create new example

router
    .route('/error')
    .get(triggerError);        // Test error handling

router
    .route('/:id')
    .get(getExampleById)       // Get single example (or 404 if not found)
    .delete(deleteExample);    // Delete example

export default router;
