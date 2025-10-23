import { Schema, model } from "mongoose";

export interface ITicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: "technical" | "billing" | "product" | "order" | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductQuery {
  id: string;
  userId?: string;
  productId: string;
  email: string;
  name: string;
  phone?: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: Date;
  status: "pending" | "answered" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  repliedBy?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "billing", "product", "order", "general"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    assignedTo: {
      type: String,
      ref: "User",
    },
    attachments: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

const productQuerySchema = new Schema<IProductQuery>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      ref: "User",
    },
    productId: {
      type: String,
      required: true,
      ref: "Product",
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
    answeredBy: {
      type: String,
      ref: "User",
    },
    answeredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "answered", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const contactSchema = new Schema<IContact>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    repliedBy: {
      type: String,
      ref: "User",
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);
export const ProductQuery = model<IProductQuery>("ProductQuery", productQuerySchema);
export const Contact = model<IContact>("Contact", contactSchema);