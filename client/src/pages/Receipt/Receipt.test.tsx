import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Receipt from "./Receipt";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import QRCode from "qrcode";
import {
  TEST_ORDER_NAME,
  TEST_STORE_MERCHANT_ID,
  TEST_STORE_ID,
} from "src/constants";
import { waitFor } from "@testing-library/react";
import * as Actions from "../Actions";
import { emptyCartItem } from "src/interfaces";
import { getStoreRedirectUrl } from "../Actions";

Enzyme.configure({ adapter: new Adapter() });

let toCanvasStub: jest.SpyInstance;
const testContents = [emptyCartItem()];

beforeAll(() => {
  jest
    .spyOn(URLSearchParams.prototype, "get")
    .mockImplementation((_) => TEST_ORDER_NAME);
  jest.spyOn(Actions, "getOrderDetails").mockReturnValue(
    new Promise((resolve, _) =>
      resolve({
        contents: testContents,
        timestamp: Date.now().toLocaleString(),
        storeId: TEST_STORE_ID,
      })
    )
  );
  toCanvasStub = jest.spyOn(QRCode, "toCanvas").mockImplementation(jest.fn());
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
  const testQRText = `$Order: ${TEST_ORDER_NAME}.\n Contents: ${testContents}`;
  await act(async () => {
    Enzyme.mount(
      <Router>
        <Receipt />
      </Router>
    );
  });

  await waitFor(() => expect(toCanvasStub).toBeCalled());
  expect(toCanvasStub).toBeCalledWith(
    null,
    testQRText,
    expect.anything(),
    expect.anything()
  );
});

it("Receipt redirects to Home upon button click", async () => {
  let wrapper: Enzyme.ReactWrapper;
  await act(async () => {
    const history = useHistory();
    wrapper = Enzyme.mount(
      <Router>
        <Receipt {...history} />
      </Router>
    );
  });

  // wait for component to load
  await waitFor(() => expect(toCanvasStub).toBeCalled());
  await act(async () => {
    const returnToStoreBtn = wrapper.find(".returnBtn").first();
    returnToStoreBtn.simulate("click");
  });

  const pushArgs = global.mockRedirectPush.mock.calls.pop();
  expect(pushArgs[0]).toEqual(
    getStoreRedirectUrl(TEST_STORE_ID, TEST_STORE_MERCHANT_ID)
  );
});
