import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import StoreList from "./StoreList";
import StoreCard from "src/components/StoreCard";
import { Store } from "src/interfaces";
import { SCANSTORE_PAGE } from "src/constants";

Enzyme.configure({ adapter: new Adapter() });

describe("StoreList Component Tests", () => {
  const TEST_STORES: Store[] = [
    {
      name: "Store1",
      "merchant-id": "TEST",
      "store-id": "TEST_STORE1",
      latitude: -1,
      longitude: -1,
    },
    {
      name: "Store2",
      "merchant-id": "TEST",
      "store-id": "TEST_STORE2",
      latitude: -1,
      longitude: -1,
    },
  ];

  it("StoreList renders correctly when empty", () => {
    const tree = renderer.create(<StoreList stores={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("StoreList renders correctly when given list of Stores", () => {
    const wrapper = Enzyme.shallow(<StoreList stores={TEST_STORES} />);
    const storeCards = wrapper.find(StoreCard);
    expect(storeCards).toHaveLength(TEST_STORES.length);
    storeCards.map((card: StoreCard, i: number) =>
      expect(card.prop("store")).toEqual(TEST_STORES[i])
    );
  });

  it("StoreList correctly enters store when clicked", () => {
    const wrapper = Enzyme.mount(<StoreList stores={TEST_STORES} />);
    const storeCard = wrapper.find(StoreCard).first();
    storeCard.simulate("click");
    const pushArgs = global.mockRedirectPush.mock.calls[0];
    expect(pushArgs[0]).toHaveProperty("pathname", SCANSTORE_PAGE);
  });
});
