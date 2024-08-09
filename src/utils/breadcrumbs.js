const baseData = ["Home"]
const geoData = [...baseData,"Geographical"]
const Users = [...baseData,"Users"]
const Settings = [...baseData,"Settings"]
const Escalations = [...baseData,"Escalations"]
const showEscalations = [...Escalations, "Opened-escalation" ,"show-escalation-details/ODI"];
const showEscalationsOTA = [...Escalations, "Opened-escalation" ,"show-escalation-details/OTA"];
const showclosedEscalations = [
  ...Escalations,
  "closed-escalation with penalty",
  "show-closed-escalation-details",
];
const PaymentInvoices = [...baseData,"Payment & Invoices"]
const clientFinder = [...baseData,"Client finder"]
const uploadFiles = [...baseData,"Upload Files"]


export const breads = {
  "/": [...baseData, "Dashboard"],
  "/profile": [...baseData, "Profile"],
  "/state-wise": [...geoData, "State-wise"],
  "/city-wise": [...geoData, "City-wise"],
  "/pin-wise": [...geoData, "Pin-wise"],
  "/add-agency": [...Users, "Add-agency"],
  "/agency-list": [...Users, "Agency-list"],
  "/add-nbfc-employee": [...Users, "Add-nbfc-employee"],
  "/nbfc-employee-list": [...Users, "Nbfc-employee-list"],
  "/add-waiver-rule": [...Settings, "Add Waiver Rule"],
  "/waiver-rules": [...Settings, "Waiver-rules"],
  "/waiver-requests": [...Settings, "Waive-requests"],
  "/add-commercial-rule": [...Settings, "Add-commercial-rule"],
  "/list-commercial-rules": [...Settings, "List-commercial-rules"],
  "/add-products": [...Settings, "Add-products"],
  "/products": [...Settings, "Products"],
  "/add-escalation": [...Escalations, "Add-escalation"],
  "/opened-escalation": [...Escalations, "Opened-escalation"],
  "/show-escalation-details/ODI=": [...showEscalations],
  "/show-escalation-details/OTA=": [...showEscalationsOTA],
  "/show-closed-escalation-details/ODQ=/MA==": [...showclosedEscalations],
  "/closed-escalation": [...Escalations, "Closed-escalation"],
  "/normal-closed-escalation": [...Escalations, "Normal-closed-escalation"],
  "/invoice-for-nbfc": [...PaymentInvoices, "Invoice-for-nbfc"],
  "/payments": [...PaymentInvoices, "Payments"],
  "/client-finder": [...clientFinder, "Client-finder"],
  "/upload-master-data": [...uploadFiles, "Upload-master-data"],
  "/assigned-data": [...uploadFiles, "Assigned-data"],
};

