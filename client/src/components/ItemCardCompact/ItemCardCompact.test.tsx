import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemCardCompact from "./ItemCardCompact";
import { CartItem, emptyCartItem } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemCardCompact Component Tests", () => {
  const testCartItem: CartItem = emptyCartItem();
  testCartItem.item = {
    barcode: "12345",
    name: "test_item",
    price: 1.0,
    "merchant-id": "test_merchant",
  };
  const props = {
    cartItem: testCartItem,
  };

  it("ItemCardCompact renders correctly", () => {
    const tree = renderer.create(<ItemCardCompact {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
