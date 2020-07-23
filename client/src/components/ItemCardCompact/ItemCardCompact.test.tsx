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
  const selectActionCallback = jest.fn();
  const props = {
    cartItem: testCartItem,
    selectActionCallback: selectActionCallback,
  };

  it("ItemCardCompact renders correctly", () => {
    const tree = renderer.create(<ItemCardCompact {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ItemCardCompact triggers selectActionCallback if registered", () => {
    const wrapper = Enzyme.shallow(<ItemCardCompact {...props} />);
    wrapper.simulate("click");
    expect(selectActionCallback).toBeCalled();
  });
});
