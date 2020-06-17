import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Cart from "../components/Cart";
import { CartItem } from "../interfaces";
import { TableBody, TableRow, TableCell } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

it("Cart renders correctly when empty", () => {
  const contents: CartItem[] = [];
  const tree = renderer.create(<Cart contents={contents} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Cart renders correctly with one item", () => {
  const contents: CartItem[] = [
    {
      item: {
        name: "cheese",
        price: 3.2,
        "merchant-id": "WPANCUD",
        barcode: "93245036",
      },
      quantity: 2,
    },
  ];
  const wrapper = Enzyme.shallow(<Cart contents={contents} />);
  const rows = wrapper.find(TableBody).find(TableRow);
  expect(rows).toHaveLength(2);
  const itemPrice = rows.last().find(TableCell).last();
  expect(itemPrice.text()).toEqual("6.40");
  const totalPrice = rows.last().find(TableCell).last();
  expect(totalPrice.text()).toEqual("6.40");
});
