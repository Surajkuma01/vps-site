/**
 * ============================================================================
 * SPREADSHEET & EXCEL WEBHOOK CONFIGURATION
 * ============================================================================
 * 
 * Put your Google Sheet / Excel Webhook URL below:
 * 
 * 1. For Google Sheets:
 *    - Open your Google Sheet.
 *    - Extensions > Apps Script.
 *    - Paste the code provided at the bottom of this file.
 *    - Click Deploy > New deployment > Select type: Web app.
 *    - Set "Execute as": Me, "Who has access": Anyone.
 *    - Copy the Web App URL and paste it below into SPREADSHEET_WEBHOOK_URL.
 * 
 * 2. For Make / Zapier / SheetDB / Excel:
 *    - Paste the Webhook URL below.
 * ============================================================================
 */

export const SPREADSHEET_WEBHOOK_URL: string = 'https://script.google.com/macros/s/AKfycbzY5TwEf6Zezdm8016bFSiIlCAljEmBoo5Te2el0hu-mWotyIOkLMXISBz4wfr6mCkMjA/exec';

export interface EnquiryData {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  budget: string;
  message: string;
  source?: string;
  sheetName?: string;
  submittedAt?: string;
}

export const PROJECT_TYPES = [
  'Luxury Residential Villa',
  'Builder Floor / Duplex',
  'Commercial / Retail Space',
  'Corporate Office Building',
  'Third-Party Turnkey Advisory',
  'Interior Architecture & Styling',
  'Plot / Site Advisory Session',
  'Other',
] as const;

export const BUDGET_RANGES = [
  'Under ₹30 Lakhs',
  '₹30 – ₹60 Lakhs',
  '₹60 Lakhs – ₹1 Crore',
  '₹1 – ₹2 Crore',
  'Above ₹2 Crore',
] as const;

/**
 * Submits enquiry data to the configured spreadsheet webhook.
 * Both the "Start a Project" modal and the home page bottom enquiry form use this exact function.
 */
export async function sendEnquiryToSpreadsheet(data: EnquiryData): Promise<{ success: boolean; message: string }> {
  const payload = {
    ...data,
    submittedAt: data.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  // If no webhook URL is configured yet, simulate successful receipt so UI testing works cleanly
  if (!SPREADSHEET_WEBHOOK_URL || SPREADSHEET_WEBHOOK_URL.trim() === '') {
    console.log('[Enquiry Form Submission - Pending Webhook URL]:', payload);
    // Simulate short network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Enquiry submitted successfully (preview mode). Paste your spreadsheet webhook URL in src/config/spreadsheet.ts to save directly into Excel/Google Sheets.',
    };
  }

  try {
    // Send data to the spreadsheet webhook.
    // 'mode: no-cors' is essential because Google Apps Script responds with a 302 redirect
    // that lacks cross-origin headers, but the data is successfully received and recorded by Google.
    await fetch(SPREADSHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Enquiry submitted and recorded successfully.',
    };
  } catch (error) {
    console.error('Failed to submit enquiry to spreadsheet:', error);
    return {
      success: false,
      message: 'Network error submitting to spreadsheet. Please verify your webhook URL or try again.',
    };
  }
}

/**
 * ============================================================================
 * GOOGLE APPS SCRIPT TEMPLATE (Copy & paste into Google Sheet Apps Script)
 * ============================================================================
 * 
 * function doPost(e) {
 *   try {
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     var data = JSON.parse(e.postData.contents);
 *     
 *     // Route to a specific tab (e.g. "Consultations") if sheetName is provided,
 *     // otherwise use the first sheet (e.g. "Sheet1" / "Enquiries")
 *     var sheet;
 *     if (data.sheetName) {
 *       sheet = ss.getSheetByName(data.sheetName);
 *       if (!sheet) {
 *         sheet = ss.insertSheet(data.sheetName);
 *       }
 *     } else {
 *       sheet = ss.getSheets()[0];
 *     }
 *     
 *     // If headers don't exist in row 1, create them automatically
 *     if (sheet.getLastRow() === 0) {
 *       if (data.sheetName === "Consultations") {
 *         sheet.appendRow([
 *           "Timestamp",
 *           "Full Name",
 *           "Contact Phone",
 *           "Email Address",
 *           "Advisory Package",
 *           "Plot / Site Location",
 *           "Estimated Plot Size / Built Area",
 *           "Specific Questions / Project Details",
 *           "Form Source"
 *         ]);
 *       } else {
 *         sheet.appendRow([
 *           "Timestamp",
 *           "Full Name",
 *           "Phone Number",
 *           "Email Address",
 *           "Project Type",
 *           "Location / City",
 *           "Approximate Budget",
 *           "Vision / Message",
 *           "Form Source"
 *         ]);
 *       }
 *     }
 *     
 *     sheet.appendRow([
 *       data.submittedAt || new Date().toLocaleString(),
 *       data.name || "",
 *       data.phone || "",
 *       data.email || "",
 *       data.projectType || "",
 *       data.location || "",
 *       data.budget || "",
 *       data.message || "",
 *       data.source || "Website"
 *     ]);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (err) {
 *     return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * ============================================================================
 */
