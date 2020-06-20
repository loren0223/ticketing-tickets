import mongoose from 'mongoose';

// For Issue #1
// An interface that describes the properties
// that are required to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}
// An interface that describes the properties
// that a Ticket Mode has
interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}

// For Issue #2
// An interface that describes the properties
// that a Ticket Document has
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Define the Ticket Schema
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Define the custom static method - build()
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
// Define the User Model
const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);

// Export Model
export { Ticket };
