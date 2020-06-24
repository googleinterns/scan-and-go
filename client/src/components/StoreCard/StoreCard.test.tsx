import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import StoreCard from "./StoreCard";
import { Store } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

describe("StoreCard Component Tests", () => {
  const TEST_STORE: Store = {
    name: "Store1",
    "merchant-id": "TEST",
    "store-id": "TEST_STORE1",
    latitude: -1,
    longitude: -1,
  };

  let redirectedUrl = "";

  const props = {
    store: TEST_STORE,
    redirect: (url: string) => {
      redirectedUrl = url;
    },
  };

  // Reset base string for capturing url redirect
  beforeEach(() => {
    redirectedUrl = "";
  });

  it("StoreCard renders correctly", () => {
    const tree = renderer.create(<StoreCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("StoreCard forms correct store redirect url", () => {
    const wrapper = Enzyme.shallow(<StoreCard {...props} />);
    wrapper.simulate("click");
    expect(redirectedUrl).toMatch(
      "?id=" + TEST_STORE["store-id"] + "&mid=" + TEST_STORE["merchant-id"]
    );
  });
});
