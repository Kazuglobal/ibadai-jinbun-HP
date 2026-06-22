const FORM_RECIPIENTS = [
  "ibadai.bj.dousou@gmail.com",
  "oodate@salat.co.jp",
];

const FORM_SHEET_NAME = "フォーム受付";
const FORM_SPREADSHEET_ID = "1SmyysSdizI69vR8_1Y8vmbKVlwPZwZChQtw5ajubqX8";

function authorizeMail() {
  return MailApp.getRemainingDailyQuota();
}

function authorizeServices() {
  MailApp.getRemainingDailyQuota();
  getFormSpreadsheet();
  return "OK";
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const type =
      payload.formType === "address-update"
        ? "住所変更届"
        : payload.formType === "event-registration"
          ? "第18回総会 参加申込"
          : "お問い合わせ";
    const details = payload.details || {};

    const lines = [
      `【${type}】`,
      `受付日時: ${payload.submittedAt || new Date().toISOString()}`,
      `お名前: ${payload.fullName || ""}`,
      `メールアドレス: ${payload.email || ""}`,
      `電話番号: ${payload.phone || ""}`,
    ];

    if (payload.formType === "event-registration") {
      lines.push(
        `ふりがな: ${payload.kana || ""}`,
        `卒業年月・学部: ${payload.gradYear || ""}`,
        `住所: ${payload.address || ""}`,
        `懇親会への参加: ${payload.partyStatus === "attend" ? "出席する（会費5,000円）" : "欠席（または総会・講演会のみ）"}`,
        "",
        "連絡事項・コメント:",
        payload.memo || "なし",
      );
    } else if (payload.formType === "address-update") {
      lines.push(
        `ふりがな: ${details.nameKana || ""}`,
        `生年月日: ${details.birthdate || ""}`,
        `卒業年: ${details.gradYear || ""}`,
        `学部・学科: ${details.department || ""}`,
        `新住所: 〒${details.postalCode || ""} ${details.prefecture || ""}${details.cityAddress || ""} ${details.building || ""}`,
      );
    } else {
      lines.push(
        `件名: ${payload.subject || ""}`,
        "",
        "お問い合わせ内容:",
        payload.message || "",
      );
    }

    MailApp.sendEmail({
      to: FORM_RECIPIENTS.join(","),
      replyTo: payload.email || undefined,
      subject: payload.subject || `【同窓会Web】${type}`,
      body: lines.join("\n"),
    });

    const sheetResult = appendFormSubmissionSafely(payload, type);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      sheet: sheetResult,
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function appendFormSubmissionSafely(payload, type) {
  try {
    appendFormSubmission(payload, type);
    return { status: "success" };
  } catch (error) {
    console.error("Spreadsheet append failed:", error);
    return { status: "error", error: String(error) };
  }
}

function appendFormSubmission(payload, type) {
  const sheet = getFormSheet();
  const details = payload.details || {};
  const submittedAt = payload.submittedAt
    ? new Date(payload.submittedAt)
    : new Date();
  const partyStatus =
    payload.partyStatus === "attend"
      ? "出席する（会費5,000円）"
      : "欠席（または総会・講演会のみ）";

  ensureHeader(sheet, [
    "受付日時",
    "種別",
    "お名前",
    "ふりがな",
    "メールアドレス",
    "電話番号",
    "卒業年月・学部",
    "住所",
    "懇親会への参加",
    "件名",
    "本文・連絡事項",
    "住所変更詳細",
  ]);

  sheet.appendRow([
    submittedAt,
    type,
    payload.fullName || "",
    payload.kana || details.nameKana || "",
    payload.email || "",
    payload.phone || "",
    payload.gradYear || details.gradYear || "",
    payload.address || buildAddress(details),
    payload.formType === "event-registration" ? partyStatus : "",
    payload.subject || "",
    payload.memo || payload.message || "",
    payload.formType === "address-update" ? JSON.stringify(details) : "",
  ]);
}

function getFormSheet() {
  const spreadsheet = getFormSpreadsheet();
  return spreadsheet.getSheetByName(FORM_SHEET_NAME) || spreadsheet.insertSheet(FORM_SHEET_NAME);
}

function getFormSpreadsheet() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") ||
    FORM_SPREADSHEET_ID;

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) return activeSpreadsheet;

  throw new Error("SPREADSHEET_ID is not configured in Apps Script properties.");
}

function ensureHeader(sheet, headers) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(headers);
  sheet.setFrozenRows(1);
}

function buildAddress(details) {
  return [
    details.postalCode ? `〒${details.postalCode}` : "",
    `${details.prefecture || ""}${details.cityAddress || ""}`,
    details.building || "",
  ].filter(Boolean).join(" ");
}
