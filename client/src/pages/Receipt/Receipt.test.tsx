import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Receipt from "./Receipt";
import { BrowserRouter as Router } from "react-router-dom";
import QRCode from "qrcode";
import { TEST_ORDER_ID } from "src/constants";

Enzyme.configure({ adapter: new Adapter() });

it("Receipt renders correctly", () => {
  const tree = renderer
    .create(
      <Router>
        {" "}
        <Receipt />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("Receipt renders QR code with order ID", () => {
  const testQRText = `$Order ID: ${TEST_ORDER_ID}`;
  jest
    .spyOn(URLSearchParams.prototype, "get")
    .mockImplementationOnce((_) => TEST_ORDER_ID);
  const toCanvasStub = jest
    .spyOn(QRCode, "toCanvas")
    .mockImplementation(jest.fn());
  const component = Enzyme.mount(
    <Router>
      <Receipt />
    </Router>
  );
  expect(toCanvasStub).toBeCalledTimes(1);
  expect(toCanvasStub).toBeCalledWith(
    null,
    testQRText,
    expect.anything(),
    expect.anything()
  );
});
