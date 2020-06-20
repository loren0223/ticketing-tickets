import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../model/ticket';

import {
  validateRequest,
  BadRequestError,
  requireAuth,
} from '@agreejwc/common';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be great than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const currentUser = req.currentuser!;
    const userId = currentUser.id;

    const existingTicket = await Ticket.findOne({ title });
    if (existingTicket) {
      throw new BadRequestError('Ticket exists');
    }

    const ticket = Ticket.build({ title, price, userId });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
