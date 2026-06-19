const FORM_RECIPIENTS = [
  "ibadai.bj.dousou@gmail.com",
  "oodate@salat.co.jp",
];

function authorizeMail() {
  return MailApp.getRemainingDailyQuota();
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

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
