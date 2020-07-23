import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemDetail from "./ItemDetail";
import { CartItem } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemDetail Component Tests", () => {
  const TEST_CARTITEM: CartItem = {
    item: {
      name: "TEST_ITEM",
      barcode: "12345",
      price: 1,
    },
    quantity: 1,
  };
  const closeCallback = jest.fn();
  const updateItemCallback = jest.fn();
  const props = {
    cartItem: TEST_CARTITEM,
    closeCallback: closeCallback,
    updateItemQuantity: updateItemCallback,
  };

  it("ItemDetail renders correctly", () => {
    const tree = renderer.create(<ItemDetail {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ItemDetail triggers close callback", async () => {
    const wrapper = Enzyme.mount(<ItemDetail {...props} />);
    const closeBtn = wrapper.find("#item-detail-dismiss").last();
    closeBtn.simulate("click");
    await waitFor(() => expect(closeCallback).toBeCalled());
  });
});
