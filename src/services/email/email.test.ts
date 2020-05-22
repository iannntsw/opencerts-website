import sinon from "sinon";
import { EMAIL_API_URL } from "../../config";
import * as sendEmail from "./index";

describe("sagas/certificate", () => {
  const email = "admin@opencerts.io";
  const captcha = "ABCD";
  const certificate = { some: "data" };

  it("calls window.fetch with right args", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const fetchStub = sinon.stub(window, "fetch").resolves({ status: 200 });

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await sendEmail.default({ certificate, captcha, email });

    expect(
      fetchStub.calledWith(EMAIL_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: certificate,
          to: email,
          captcha,
        }),
      })
    ).toBe(true);
    fetchStub.restore();
  });

  it("resolves when 200 is returned", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const fetchStub = sinon.stub(window, "fetch").resolves({ status: 200 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const res = await sendEmail.default({ certificate, captcha, email });
    expect(res).toBe(true);
    fetchStub.restore();
  });

  it("rejects when non-200 code is returned", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const fetchStub = sinon.stub(window, "fetch").resolves({ status: 400 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const res = await sendEmail.default({ certificate, captcha, email });
    expect(res).toBe(false);
    fetchStub.restore();
  });
});