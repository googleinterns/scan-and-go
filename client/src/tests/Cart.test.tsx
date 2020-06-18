import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Cart from "../components/Cart";
import { CartItem } from "../interfaces";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { PRICE_FRACTION_DIGITS } from "../constants";

Enzyme.configure({ adapter: new Adapter() });

it("Cart renders correctly when empty", () => {
  const tree = renderer.create(<Cart contents={[]} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Cart renders correctly with multiple items", () => {
  const cheese: CartItem = {
    item: {
      name: "cheese",
      price: 3.2,
      "merchant-id": "WPANCUD",
      barcode: "93245036",
    },
    quantity: 2,
  };
  const milk: CartItem = {
    item: {
      name: "milk",
      price: 5.6,
      "merchant-id": "WPANCUD",
      barcode: "93202411",
    },
    quantity: 1,
  };
  const expectedCheesePrice = cheese.item.price * cheese.quantity;
  const expectedMilkPrice = milk.item.price * milk.quantity;
  const expectedTotalPrice = expectedCheesePrice + expectedMilkPrice;

  const wrapper = Enzyme.shallow(<Cart contents={[cheese, milk]} />);
  const rows = wrapper.find(TableBody).find(TableRow);
  expect(rows).toHaveLength(3);
  const cheesePrice = rows.first().find(TableCell).last();
  expect(cheesePrice.text()).toEqual(
    expectedCheesePrice.toFixed(PRICE_FRACTION_DIGITS)
  );
  const totalPrice = rows.last().find(TableCell).last();
  expect(totalPrice.text()).toEqual(
    expectedTotalPrice.toFixed(PRICE_FRACTION_DIGITS)
  );
});
