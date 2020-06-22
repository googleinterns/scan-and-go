import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemCard from "./ItemCard";
import { CartItem, emptyCartItem } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemCard Component Tests", () => {
  const INIT_QUANTITY: number = 1;
  let num: number = INIT_QUANTITY;
  const testCartItem: CartItem = emptyCartItem();
  testCartItem.item = {
    barcode: "12345",
    name: "test_item",
    price: 1.0,
    "merchant-id": "test_merchant",
  };
  const props = {
    cartItem: testCartItem,
    updateItemQuantity: (barcode: string, quantity: number) => {
      num = quantity;
    },
  };

  // Fresh reset dummy values for testCartItem
  beforeEach(() => {
    testCartItem.quantity = INIT_QUANTITY;
  });

  it("ItemCard renders correctly", () => {
    const tree = renderer.create(<ItemCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ItemCard triggers increment correctly", () => {
    const wrapper = Enzyme.shallow(<ItemCard {...props} />);
    const incBtn = wrapper.find("#inc").last();
    incBtn.simulate("click");
    expect(num).toBe(2);
  });

  it("ItemCard triggers decrement correctly", () => {
    const wrapper = Enzyme.shallow(<ItemCard {...props} />);
    const decBtn = wrapper.find("#dec").last();
    decBtn.simulate("click");
    expect(num).toBe(0);
  });
});
