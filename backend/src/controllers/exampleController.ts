import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';

/**
 * Example interface for data structure
 */
interface ExampleItem {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

// Mock data for demonstration
const mockExamples: ExampleItem[] = [
    {
        id: '1',
        name: 'Example 1',
        description: 'This is the first example',
        createdAt: new Date(),
    },
    {
        id: '2',
        name: 'Example 2',
        description: 'This is the second example',
        createdAt: new Date(),
    },
];

/**
 * @route   GET /api/v1/examples
 * @desc    Get all examples
 * @access  Public
 */
export const getAllExamples = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        results: mockExamples.length,
        data: {
            examples: mockExamples,
        },
    });
});

/**
 * @route   GET /api/v1/examples/:id
 * @desc    Get single example by ID
 * @access  Public
 */
export const getExampleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const example = mockExamples.find(item => item.id === id);

    if (!example) {
        throw new AppError(`No example found with ID: ${id}`, 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            example,
        },
    });
});

/**
 * @route   POST /api/v1/examples
 * @desc    Create a new example
 * @access  Public
 */
export const createExample = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    // Validation
    if (!name || !description) {
        throw new AppError('Please provide both name and description', 400);
    }

    const newExample: ExampleItem = {
        id: String(mockExamples.length + 1),
        name,
        description,
        createdAt: new Date(),
    };

    mockExamples.push(newExample);

    res.status(201).json({
        status: 'success',
        data: {
            example: newExample,
        },
    });
});

/**
 * @route   GET /api/v1/examples/error
 * @desc    Trigger an error for testing error handling
 * @access  Public
 */
export const triggerError = asyncHandler(async (_req: Request, _res: Response) => {
    // This will be caught by asyncHandler and forwarded to error handler
    throw new Error('This is a test error to demonstrate error handling');
});

/**
 * @route   DELETE /api/v1/examples/:id
 * @desc    Delete an example by ID
 * @access  Public
 */
export const deleteExample = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const index = mockExamples.findIndex(item => item.id === id);

    if (index === -1) {
        throw new AppError(`No example found with ID: ${id}`, 404);
    }

    mockExamples.splice(index, 1);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
