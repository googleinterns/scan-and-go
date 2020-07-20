import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Checkout from "./Checkout";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import {
  TEST_ORDER_NAME,
  RECEIPT_PAGE,
  TEST_STORE_ID,
  TEST_ORDER_ID,
} from "src/constants";
import { emptyCartItem } from "src/interfaces";
import * as Actions from "../Actions";
import AlertSnackbar from "src/components/AlertSnackbar";
import { AlertContext } from "src/contexts/AlertContext";

Enzyme.configure({ adapter: new Adapter() });

beforeAll(() => {
  jest.useFakeTimers();
  useHistory.mockImplementation(() => {
    return {
      push: global.mockRedirectPush,
      location: {
        state: {
          store: { name: TEST_STORE_ID },
          contents: [emptyCartItem()],
        },
      },
    };
  });
});

it("Checkout renders correctly", async () => {
  let tree;
  await renderer.act(async () => {
    tree = renderer
      .create(
        <Router>
          <Checkout />
        </Router>
      )
      .toJSON();
  });
  expect(tree).toMatchSnapshot();
});

it("Checkout redirects to Receipt and sets successs alert upon successful order", async () => {
  jest
    .spyOn(Actions, "createOrder")
    .mockReturnValue({ name: TEST_ORDER_NAME, orderId: TEST_ORDER_ID });
  const mockSetAlert = jest.fn();
  const mockAlertContext = {
    setAlert: mockSetAlert,
  };

  await act(async () => {
    const wrapper = Enzyme.mount(
      <AlertContext.Provider value={mockAlertContext}>
        <Router>
          <Checkout />
        </Router>
      </AlertContext.Provider>
    );
    const btns = wrapper.find("button");
    expect(btns).toHaveLength(1);
    const makePaymentBtn = btns.first();
    makePaymentBtn.simulate("click");
    jest.runAllTimers();
  });

  const pushArgs = global.mockRedirectPush.mock.calls.pop();
  expect(pushArgs[0]).toHaveProperty("pathname", RECEIPT_PAGE);
  expect(pushArgs[0]).toHaveProperty("search", `?order=${TEST_ORDER_NAME}`);
  expect(mockSetAlert).toBeCalledWith(
    "success",
    `Order ${TEST_ORDER_ID} Confirmed!`
  );
});
