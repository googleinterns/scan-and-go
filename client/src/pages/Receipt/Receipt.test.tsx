import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Receipt from "./Receipt";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import QRCode from "qrcode";
import { TEST_ORDER_NAME, HOME_PAGE } from "src/constants";
import { waitFor } from "@testing-library/react";

Enzyme.configure({ adapter: new Adapter() });

beforeAll(() => {
  jest
    .spyOn(URLSearchParams.prototype, "get")
    .mockImplementation((_) => TEST_ORDER_NAME);
});

it("Receipt renders correctly", async () => {
  let tree;
  await renderer.act(async () => {
    tree = renderer
      .create(
        <Router>
          <Receipt />
        </Router>
      )
      .toJSON();
  });
  expect(tree).toMatchSnapshot();
});

it("Receipt renders QR code with order ID", async () => {
  const testQRText = `$Order ID: ${TEST_ORDER_NAME}`;
  const toCanvasStub = jest
    .spyOn(QRCode, "toCanvas")
    .mockImplementation(jest.fn());

  await act(async () => {
    const wrapper = Enzyme.mount(
      <Router>
        <Receipt />
      </Router>
    );
  });

  await waitFor(() => expect(toCanvasStub).toBeCalledTimes(1));
  expect(toCanvasStub).toBeCalledWith(
    null,
    testQRText,
    expect.anything(),
    expect.anything()
  );
});

it("Receipt redirects to Home upon button click", async () => {
  await act(async () => {
    const history = useHistory();
    const wrapper = Enzyme.mount(
      <Router>
        <Receipt {...history} />
      </Router>
    );
    const btns = wrapper.find("button");
    expect(btns).toHaveLength(1);
    const returnToHomeBtn = btns.first();
    returnToHomeBtn.simulate("click");
  });

  const pushArgs = global.mockRedirectPush.mock.calls.pop();
  expect(pushArgs[0]).toHaveProperty("pathname", HOME_PAGE);
});
