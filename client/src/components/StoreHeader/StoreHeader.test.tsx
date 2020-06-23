import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import StoreHeader from "./StoreHeader";
import { Store } from "src/interfaces";

Enzyme.configure({ adapter: new Adapter() });

describe("StoreHeader Component Tests", () => {
  const testStore: Store = {
    "store-id": "test_store",
    "merchant-id": "test_merchant",
    name: "TEST_STORE",
  };
  const props = {
    store: testStore,
    link: "/link",
    linkText: "link",
  };

  it("StoreHeader renders correctly", () => {
    const tree = renderer.create(<StoreHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("StoreHeader back button triggers correctly", () => {
    const wrapper = Enzyme.shallow(<StoreHeader {...props} />);
    const backBtn = wrapper.find("#back").last();
    backBtn.simulate("click");
    expect(global.mockRedirectPush).toBeCalledWith(props.link);
  });
});
