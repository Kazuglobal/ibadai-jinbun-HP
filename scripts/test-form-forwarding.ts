import assert from "node:assert/strict";
import http from "node:http";

const receivedPayloads: any[] = [];

const webhookServer = http.createServer((request, response) => {
  let body = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    body += chunk;
  });
  request.on("end", () => {
    receivedPayloads.push(JSON.parse(body));
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "success" }));
  });
});

await new Promise<void>((resolve) => webhookServer.listen(0, "127.0.0.1", resolve));
const webhookAddress = webhookServer.address();
assert(webhookAddress && typeof webhookAddress !== "string");

process.env.VERCEL = "1";
process.env.FORM_WEBHOOK_URL = `http://127.0.0.1:${webhookAddress.port}`;
process.env.GAS_WEBAPP_URL = `http://127.0.0.1:${webhookAddress.port}`;

const { default: app } = await import("../server");
const appServer = app.listen(0, "127.0.0.1");
await new Promise<void>((resolve) => appServer.once("listening", resolve));
const appAddress = appServer.address();
assert(appAddress && typeof appAddress !== "string");
const apiBase = `http://127.0.0.1:${appAddress.port}`;

try {
  const contactResponse = await fetch(`${apiBase}/api/forms/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "contact",
      fullName: "問い合わせ 太郎",
      email: "contact@example.com",
      phone: "090-1111-2222",
      subject: "会報について",
      message: "会報の送付について確認したいです。",
      website: "",
    }),
  });
  assert.equal(contactResponse.status, 200);

  const addressResponse = await fetch(`${apiBase}/api/forms/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "address-update",
      fullName: "住所 花子",
      email: "address@example.com",
      phone: "080-3333-4444",
      details: {
        nameKana: "ジュウショ ハナコ",
        birthdate: "1980/01/01",
        gradYear: "2002年",
        department: "人文学部 文学科",
        postalCode: "310-8512",
        prefecture: "茨城県",
        cityAddress: "水戸市文京2-1-1",
        building: "同窓会館101",
      },
      website: "",
    }),
  });
  assert.equal(addressResponse.status, 200);

  const eventResponse = await fetch(`${apiBase}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "総会 一郎",
      kana: "ソウカイ イチロウ",
      gradYear: "1999年 人文学部",
      address: "茨城県水戸市文京2-1-1",
      phone: "029-000-0000",
      partyStatus: "attend",
      memo: "総会フォームの送信テストです。",
    }),
  });
  assert.equal(eventResponse.status, 200);

  assert.equal(receivedPayloads.length, 3);
  for (const payload of receivedPayloads) {
    assert.deepEqual(payload.recipients, [
      "ibadai.bj.dousou@gmail.com",
      "oodate@salat.co.jp",
    ]);
  }
  assert.equal(receivedPayloads[0].formType, "contact");
  assert.equal(receivedPayloads[0].message, "会報の送付について確認したいです。");
  assert.equal(receivedPayloads[1].formType, "address-update");
  assert.equal(receivedPayloads[1].details.cityAddress, "水戸市文京2-1-1");
  assert.equal(receivedPayloads[1].details.subscribeMail, undefined);
  assert.equal(receivedPayloads[2].formType, "event-registration");
  assert.equal(receivedPayloads[2].partyStatus, "attend");

  const invalidResponse = await fetch(`${apiBase}/api/forms/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "contact",
      fullName: "",
      email: "invalid",
      subject: "",
      message: "",
    }),
  });
  assert.equal(invalidResponse.status, 400);

  console.log("Form forwarding integration test passed.");
} finally {
  await new Promise<void>((resolve, reject) =>
    appServer.close((error) => (error ? reject(error) : resolve())),
  );
  await new Promise<void>((resolve, reject) =>
    webhookServer.close((error) => (error ? reject(error) : resolve())),
  );
}
