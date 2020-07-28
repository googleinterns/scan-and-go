import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ScanStore from "./ScanStore";
import { BrowserRouter as Router } from "react-router-dom";
import { TEST_ORDER_NAME, RECEIPT_PAGE, TEST_ORDER_ID } from "src/constants";
import * as Actions from "../Actions";
import { AlertContext } from "src/contexts/AlertContext";
import { emptyCartItem } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

it("ScanStore renders correctly", async () => {
  let tree;
  await renderer.act(async () => {
    tree = renderer
      .create(
        <Router>
          <ScanStore />
        </Router>
      )
      .toJSON();
  });
  expect(tree).toMatchSnapshot();
});

it("ScanStore disables checkout if cart is empty", async () => {
  await act(async () => {
    const wrapper = Enzyme.mount(
      <Router>
        <ScanStore />
      </Router>
    );
    const checkoutBtn = wrapper.find(".checkoutBtn").last();
    expect(checkoutBtn.is("[disabled]")).toBe(true);
  });
});

it("ScanStore redirects to Receipt and sets successs alert upon successful order", async () => {
  jest
    .spyOn(Actions, "createOrder")
    .mockReturnValueOnce(
      new Promise((resolve, _) =>
        resolve({ name: TEST_ORDER_NAME, orderId: TEST_ORDER_ID })
      )
    );
  jest.spyOn(Actions, "getCart").mockReturnValueOnce([emptyCartItem()]);
  const mockSetAlert = jest.fn();
  const mockAlertContext = {
    setAlert: mockSetAlert,
  };

  await act(async () => {
    const wrapper = Enzyme.mount(
      <AlertContext.Provider value={mockAlertContext}>
        <Router>
          <ScanStore />
        </Router>
      </AlertContext.Provider>
    );
    const checkoutBtn = wrapper.find(".checkoutBtn").last();
    checkoutBtn.simulate("click");
    expect(checkoutBtn.is("[disabled]")).toBe(true);
  });

  const pushArgs = global.mockRedirectPush.mock.calls.pop();
  expect(pushArgs[0]).toHaveProperty("pathname", RECEIPT_PAGE);
  expect(pushArgs[0]).toHaveProperty("search", `?order=${TEST_ORDER_NAME}`);
  expect(mockSetAlert).toBeCalledWith(
    "success",
    `Order ${TEST_ORDER_ID} Confirmed!`
  );
});
