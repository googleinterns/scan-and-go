import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Cart from "./Cart";
import ItemCard from "src/components/ItemCard";
import { CartItem } from "src/interfaces";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { PRICE_FRACTION_DIGITS } from "src/constants";

Enzyme.configure({ adapter: new Adapter() });

describe("Cart Component Tests", () => {
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

  const props = {
    contents: TEST_ITEMS,
  };

  it("Cart renders correctly when empty", () => {
    const tree = renderer.create(<Cart contents={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Cart renders correctly with multiple items", () => {
    const wrapper = Enzyme.shallow(<Cart {...props} />);
    const itemCards = wrapper.find(ItemCard);
    expect(itemCards).toHaveLength(TEST_ITEMS.length);

    itemCards.map((card: ItemCard, i: number) =>
      expect(card.prop("cartItem")).toEqual(TEST_ITEMS[i])
    );
  });
});
