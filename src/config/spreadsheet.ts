import { type Project } from '../data/projects';

/**
 * ============================================================================
 * SPREADSHEET & CLOUD CMS CONFIGURATION
 * ============================================================================
 * 
 * Your Google Apps Script Webhook URL:
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
 */
export async function sendEnquiryToSpreadsheet(data: EnquiryData): Promise<{ success: boolean; message: string }> {
  const payload = {
    ...data,
    submittedAt: data.submittedAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  if (!SPREADSHEET_WEBHOOK_URL || SPREADSHEET_WEBHOOK_URL.trim() === '') {
    console.log('[Enquiry Form Submission - Pending Webhook URL]:', payload);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Enquiry submitted successfully (preview mode).',
    };
  }

  try {
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
      message: 'Network error submitting to spreadsheet.',
    };
  }
}

/**
 * Fetches live synchronized projects from the Cloud / Google Sheet.
 */
export async function fetchRemoteProjects(): Promise<Project[] | null> {
  if (!SPREADSHEET_WEBHOOK_URL || SPREADSHEET_WEBHOOK_URL.trim() === '') return null;
  try {
    const res = await fetch(`${SPREADSHEET_WEBHOOK_URL}?action=getProjects`, {
      method: 'GET',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    if (data && Array.isArray(data.projects) && data.projects.length > 0) return data.projects;
    return null;
  } catch (err) {
    console.warn('[Cloud Sync] Note: Remote projects not reachable yet, using local store:', err);
    return null;
  }
}

/**
 * Saves live synchronized projects to the Cloud / Google Sheet.
 */
export async function syncProjectsToCloud(projects: Project[]): Promise<boolean> {
  if (!SPREADSHEET_WEBHOOK_URL || SPREADSHEET_WEBHOOK_URL.trim() === '') return false;
  try {
    await fetch(SPREADSHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'saveProjects',
        projects,
        syncedAt: new Date().toISOString(),
      }),
    });
    return true;
  } catch (err) {
    console.error('[Cloud Sync] Failed to sync projects to cloud:', err);
    return false;
  }
}

/**
 * ============================================================================
 * GOOGLE APPS SCRIPT CODE TEMPLATE
 * (Copy & paste this entire code into your Google Sheet: Extensions > Apps Script)
 * ============================================================================
 * 
 * function doGet(e) {
 *   var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";
 *   var ss = SpreadsheetApp.getActiveSpreadsheet();
 * 
 *   // 1. Return live CMS projects for all visitors
 *   if (action === "getProjects") {
 *     var sheet = ss.getSheetByName("CMS_Projects");
 *     if (sheet && sheet.getLastRow() >= 2) {
 *       var jsonText = sheet.getRange(2, 1).getValue();
 *       return ContentService.createTextOutput(jsonText)
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *     return ContentService.createTextOutput(JSON.stringify({ projects: [] }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * 
 *   return ContentService.createTextOutput(JSON.stringify({ status: "alive" }))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   try {
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     var data = JSON.parse(e.postData.contents);
 * 
 *     // 1. Live CMS Projects Sync from Admin Panel
 *     if (data.action === "saveProjects") {
 *       var sheet = ss.getSheetByName("CMS_Projects");
 *       if (!sheet) {
 *         sheet = ss.insertSheet("CMS_Projects");
 *       }
 *       sheet.clear();
 *       sheet.getRange(1, 1).setValue("Projects_JSON_Payload");
 *       sheet.getRange(2, 1).setValue(JSON.stringify(data.projects));
 *       return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Projects synced successfully" }))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 * 
 *     // 2. Client Enquiry Form Submissions
 *     var sheetName = data.sheetName || "Enquiries";
 *     var sheet = ss.getSheetByName(sheetName);
 *     if (!sheet) {
 *       sheet = ss.insertSheet(sheetName);
 *     }
 * 
 *     if (sheet.getLastRow() === 0) {
 *       if (sheetName === "Consultations") {
 *         sheet.appendRow([
 *           "Timestamp", "Full Name", "Contact Phone", "Email Address",
 *           "Advisory Package", "Plot / Site Location", "Estimated Plot Size / Built Area",
 *           "Specific Questions / Project Details", "Form Source"
 *         ]);
 *       } else {
 *         sheet.appendRow([
 *           "Timestamp", "Full Name", "Phone Number", "Email Address",
 *           "Project Type", "Location / City", "Approximate Budget",
 *           "Vision / Message", "Form Source"
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
