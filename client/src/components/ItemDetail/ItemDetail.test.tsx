import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemDetail from "./ItemDetail";
import { Item, CartItem } from "src/interfaces";
import { Button } from "@material-ui/core";
import { deepHtmlStringMatch } from "src/utils";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemDetail Component Tests", () => {
  const TEST_ITEM: Item = {
    name: "TEST_ITEM",
    barcode: "12345",
    price: 1,
  };
  const TEST_CARTITEM: CartItem = {
    item: TEST_ITEM,
    quantity: 1,
  };
  const TEST_CARTITEMS: CartItem[] = [TEST_CARTITEM];
  const closeCallback = jest.fn();
  const updateItemCallback = jest.fn();
  const props = {
    cartItem: TEST_CARTITEM,
    closeCallback: closeCallback,
    updateItemCallback: updateItemCallback,
    currentCart: TEST_CARTITEMS,
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

  it("ItemDetail triggers update item info", () => {
    const wrapper = Enzyme.shallow(<ItemDetail {...props} />);
    const actionBtn = wrapper.find(Button).last();
    actionBtn.simulate("click");
    expect(updateItemCallback).toBeCalled();
  });

  it("ItemDetail correctly renders remove text", async () => {
    // Render item without quantity
    Object.assign(TEST_CARTITEM, { quantity: 0 });
    const wrapper = Enzyme.mount(<ItemDetail {...props} />);
    const actionBtn = wrapper.find(Button).last();
    waitFor(() =>
      expect(deepHtmlStringMatch(actionBtn, "Remove Item")).toBe(true)
    );
    // Reinstate quantity
    Object.assign(TEST_CARTITEM, { quantity: 1 });
  });

  it("ItemDetail correctly renders Add text for new item", async () => {
    // Temporarily remove item from props
    Object.assign(props, { currentCart: [] });
    const wrapper = Enzyme.mount(<ItemDetail {...props} />);
    const actionBtn = wrapper.find(Button).last();
    waitFor(() =>
      expect(deepHtmlStringMatch(actionBtn, "Add Item")).toBe(true)
    );
    // Reinstate prop currentCart
    Object.assign(props, { currentCart: TEST_CARTITEMS });
  });

  it("ItemDetail correctly renders Change text for existing item", async () => {
    const wrapper = Enzyme.mount(<ItemDetail {...props} />);
    const actionBtn = wrapper.find(Button).last();
    waitFor(() =>
      expect(deepHtmlStringMatch(actionBtn, "Confirm Change")).toBe(true)
    );
  });

  it("ItemDetail renders button disabled on no item", () => {
    // Temporarily remove item from props
    Object.assign(props, { cartItem: undefined });
    const wrapper = Enzyme.shallow(<ItemDetail {...props} />);
    const actionBtn = wrapper.find(Button).last();
    expect(actionBtn.prop("disabled")).toBe(true);
    // Reinstate cartItem
    Object.assign(props, { cartItem: TEST_CARTITEM });
  });
});
