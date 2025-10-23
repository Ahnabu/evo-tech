import { ITicket, IProductQuery, IContact, Ticket, ProductQuery, Contact } from "./support.model";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

// Ticket Services
const createTicketIntoDB = async (payload: Partial<ITicket>): Promise<ITicket> => {
  const ticketData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await Ticket.create(ticketData);
  return result;
};

const getAllTicketsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { subject: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  if (query.priority) {
    searchQuery.priority = query.priority;
  }

  if (query.category) {
    searchQuery.category = query.category;
  }

  if (query.assignedTo) {
    searchQuery.assignedTo = query.assignedTo;
  }

  const result = await Ticket.find(searchQuery)
    .populate("userId assignedTo")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Ticket.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleTicketFromDB = async (id: string): Promise<ITicket> => {
  const result = await Ticket.findOne({ id }).populate("userId assignedTo");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
  }

  return result;
};

const updateTicketIntoDB = async (
  id: string,
  payload: Partial<ITicket>
): Promise<ITicket> => {
  const result = await Ticket.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("userId assignedTo");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
  }

  return result;
};

const deleteTicketFromDB = async (id: string): Promise<void> => {
  const result = await Ticket.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Ticket not found");
  }
};

// Product Query Services
const createProductQueryIntoDB = async (payload: Partial<IProductQuery>): Promise<IProductQuery> => {
  const queryData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await ProductQuery.create(queryData);
  return result;
};

const getAllProductQueriesFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { question: { $regex: query.search, $options: "i" } },
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  if (query.productId) {
    searchQuery.productId = query.productId;
  }

  const result = await ProductQuery.find(searchQuery)
    .populate("userId productId answeredBy")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await ProductQuery.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleProductQueryFromDB = async (id: string): Promise<IProductQuery> => {
  const result = await ProductQuery.findOne({ id }).populate("userId productId answeredBy");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product query not found");
  }

  return result;
};

const updateProductQueryIntoDB = async (
  id: string,
  payload: Partial<IProductQuery>
): Promise<IProductQuery> => {
  // If providing an answer, set answered date and status
  if (payload.answer && !payload.answeredAt) {
    payload.answeredAt = new Date();
    payload.status = "answered";
  }

  const result = await ProductQuery.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("userId productId answeredBy");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product query not found");
  }

  return result;
};

const deleteProductQueryFromDB = async (id: string): Promise<void> => {
  const result = await ProductQuery.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product query not found");
  }
};

// Contact Services
const createContactIntoDB = async (payload: Partial<IContact>): Promise<IContact> => {
  const contactData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await Contact.create(contactData);
  return result;
};

const getAllContactsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { subject: { $regex: query.search, $options: "i" } },
      { message: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  const result = await Contact.find(searchQuery)
    .populate("repliedBy")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Contact.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleContactFromDB = async (id: string): Promise<IContact> => {
  const result = await Contact.findOne({ id }).populate("repliedBy");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

const updateContactIntoDB = async (
  id: string,
  payload: Partial<IContact>
): Promise<IContact> => {
  // If marking as replied, set reply date
  if (payload.status === "replied" && !payload.repliedAt) {
    payload.repliedAt = new Date();
  }

  const result = await Contact.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("repliedBy");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

const deleteContactFromDB = async (id: string): Promise<void> => {
  const result = await Contact.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }
};

// Stats Services
const getSupportStatsFromDB = async () => {
  const ticketStats = await Ticket.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const productQueryStats = await ProductQuery.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const contactStats = await Contact.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    tickets: ticketStats,
    productQueries: productQueryStats,
    contacts: contactStats,
  };
};

export const SupportServices = {
  // Ticket services
  createTicketIntoDB,
  getAllTicketsFromDB,
  getSingleTicketFromDB,
  updateTicketIntoDB,
  deleteTicketFromDB,
  
  // Product query services
  createProductQueryIntoDB,
  getAllProductQueriesFromDB,
  getSingleProductQueryFromDB,
  updateProductQueryIntoDB,
  deleteProductQueryFromDB,
  
  // Contact services
  createContactIntoDB,
  getAllContactsFromDB,
  getSingleContactFromDB,
  updateContactIntoDB,
  deleteContactFromDB,
  
  // Stats
  getSupportStatsFromDB,
};