import React from "react";
import renderer from "react-test-renderer";
import Cart from "../components/Cart";
import { CartItem, emptyCartItem } from "../interfaces";

it("Cart renders correctly", () => {
  let state: string = "";
  const contents: CartItem[] = [emptyCartItem];
  const tree = renderer.create(<Cart contents={contents} />).toJSON();
  expect(tree).toMatchSnapshot();
});
