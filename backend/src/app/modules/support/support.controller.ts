import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SupportServices } from "./support.service";

// Ticket Controllers
const createTicket = catchAsync(async (req, res) => {
  const result = await SupportServices.createTicketIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ticket created successfully",
    data: result,
  });
});

const getAllTickets = catchAsync(async (req, res) => {
  const tickets = await SupportServices.getAllTicketsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tickets retrieved successfully",
    data: tickets.result,
    meta: tickets.meta,
  });
});

const getSingleTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.getSingleTicketFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ticket retrieved successfully",
    data: result,
  });
});

const updateTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.updateTicketIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ticket updated successfully",
    data: result,
  });
});

const deleteTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SupportServices.deleteTicketFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ticket deleted successfully",
    data: null,
  });
});

// Product Query Controllers
const createProductQuery = catchAsync(async (req, res) => {
  const result = await SupportServices.createProductQueryIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product query created successfully",
    data: result,
  });
});

const getAllProductQueries = catchAsync(async (req, res) => {
  const queries = await SupportServices.getAllProductQueriesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product queries retrieved successfully",
    data: queries.result,
    meta: queries.meta,
  });
});

const getSingleProductQuery = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.getSingleProductQueryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product query retrieved successfully",
    data: result,
  });
});

const updateProductQuery = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.updateProductQueryIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product query updated successfully",
    data: result,
  });
});

const deleteProductQuery = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SupportServices.deleteProductQueryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product query deleted successfully",
    data: null,
  });
});

// Contact Controllers
const createContact = catchAsync(async (req, res) => {
  const result = await SupportServices.createContactIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Contact message created successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const contacts = await SupportServices.getAllContactsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contacts retrieved successfully",
    data: contacts.result,
    meta: contacts.meta,
  });
});

const getSingleContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.getSingleContactFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact retrieved successfully",
    data: result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupportServices.updateContactIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact updated successfully",
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SupportServices.deleteContactFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact deleted successfully",
    data: null,
  });
});

// Stats Controller
const getSupportStats = catchAsync(async (req, res) => {
  const result = await SupportServices.getSupportStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Support statistics retrieved successfully",
    data: result,
  });
});

export const SupportControllers = {
  // Ticket controllers
  createTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
  deleteTicket,
  
  // Product query controllers
  createProductQuery,
  getAllProductQueries,
  getSingleProductQuery,
  updateProductQuery,
  deleteProductQuery,
  
  // Contact controllers
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContact,
  
  // Stats
  getSupportStats,
};