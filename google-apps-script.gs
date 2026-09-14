/**
 * DAKBAKSO — Order form receiver
 *
 * Setup:
 * 1. Create a Google Sheet. Rename the first tab to "Orders".
 * 2. In row 1 of the "Orders" tab, add these exact headers:
 *    timestamp | service | package | budget | name | contact | email | details
 * 3. In the Sheet, go to Extensions > Apps Script, delete any starter code,
 *    and paste this whole file in.
 * 4. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL it gives you (ends in /exec).
 * 6. Paste that URL into ORDER_ENDPOINT in js/script.js on the website.
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.service || "",
    data.package || "",
    data.budget || "",
    data.name || "",
    data.contact || "",
    data.email || "",
    data.details || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput("Dakbakso order endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
