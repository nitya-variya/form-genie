export const TEMPLATES: Record<string, { label: string; prompt: string }> = {
  contact: {
    label: "Contact Form",
    prompt:
      "Create a professional contact form with fields for full name, email address, phone number (optional), subject line with dropdown options (General Inquiry, Support, Sales, Partnership), and a message textarea. Include proper validation for email and phone.",
  },
  jobApplication: {
    label: "Job Application",
    prompt:
      "Create a job application form with fields for full name, email, phone number, position applied for (dropdown: Frontend Developer, Backend Developer, Designer, Project Manager), years of experience (number, 0-30), portfolio URL (optional), expected salary range (number), availability date, and a cover letter textarea. Make URL and salary optional.",
  },
  bugReport: {
    label: "Bug Report",
    prompt:
      "Create a bug report form with fields for reporter name, reporter email, bug title, severity (radio: Critical, High, Medium, Low), browser (select: Chrome, Firefox, Safari, Edge, Other), operating system (select: Windows, macOS, Linux, iOS, Android), steps to reproduce (textarea), expected behavior (textarea), and actual behavior (textarea). Include an option to attach screenshot URL.",
  },
  eventRegistration: {
    label: "Event Registration",
    prompt:
      "Create an event registration form with fields for attendee name, email, phone, company/organization (optional), job title (optional), ticket type (radio: General Admission, VIP, Student), dietary restrictions (checkbox: None, Vegetarian, Vegan, Gluten-Free, Halal, Kosher), t-shirt size (select: XS, S, M, L, XL, XXL), and special accommodations (textarea, optional).",
  },
  clientBrief: {
    label: "Client Brief",
    prompt:
      "Create a client project brief form with fields for company name, contact person name, email, phone, project type (select: Website, Mobile App, Branding, Marketing Campaign, Other), budget range (radio: Under $5k, $5k-$15k, $15k-$50k, $50k+), timeline (select: 1 month, 2-3 months, 3-6 months, 6+ months), project description (textarea), target audience (textarea), and competitor URLs (textarea, optional).",
  },
  userFeedback: {
    label: "User Feedback",
    prompt:
      "Create a user feedback form with fields for name (optional), email (optional), overall satisfaction (radio: Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied), ease of use rating (range 1-10), features used (checkbox: Dashboard, Reports, Settings, API, Integrations), what you liked most (textarea), what could be improved (textarea), and would you recommend us (radio: Yes, No, Maybe).",
  },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATES);
