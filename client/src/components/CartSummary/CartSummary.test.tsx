import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CartSummary from "./CartSummary";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS } from "src/constants";

Enzyme.configure({ adapter: new Adapter() });

describe("CartSummary Component Tests", () => {
  const TEST_ITEMS: CartItem[] = [
    {
      item: {
        name: "cheese",
        price: 3.2,
        "merchant-id": "WPANCUD",
        barcode: "93245036",
      },
      quantity: 2,
    },
    {
      item: {
        name: "milk",
        price: 5.6,
        "merchant-id": "WPANCUD",
        barcode: "93202411",
      },
      quantity: 1,
    },
  ];
  const computationCallback = jest.fn();

  const ITEMS_SUBTOTAL = 12;
  const ITEMS_GST = 0.84;
  const ITEMS_TOTAL = 12.84;

  const props = {
    cartItems: TEST_ITEMS,
    setTotalCallback: computationCallback,
  };

  it("CartSummary renders correctly", () => {
    const tree = renderer.create(<CartSummary {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("CartSummary computes sum of cart items", () => {
    const wrapper = Enzyme.shallow(<CartSummary {...props} />);
    const dispSubtotal = wrapper.find("#cart-summary-subtotal");
    const dispGst = wrapper.find("#cart-summary-gst");
    const dispTotal = wrapper.find("#cart-summary-total");
    expect(dispSubtotal.text()).toMatch(
      `$${ITEMS_SUBTOTAL.toFixed(PRICE_FRACTION_DIGITS)}`
    );
    expect(dispGst.text()).toMatch(
      `$${ITEMS_GST.toFixed(PRICE_FRACTION_DIGITS)}`
    );
    expect(dispTotal.text()).toMatch(
      `$${ITEMS_TOTAL.toFixed(PRICE_FRACTION_DIGITS)}`
    );
  });

  it("CartSummary calls callback to return computed value", () => {
    const wrapper = Enzyme.mount(<CartSummary {...props} />);
    expect(computationCallback).toBeCalledWith(ITEMS_TOTAL);
  });
});
