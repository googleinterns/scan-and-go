import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CartHeader from "./CartHeader";

Enzyme.configure({ adapter: new Adapter() });

describe("CartHeader Component Tests", () => {
  const props = {
    store: {
      name: "TEST_STORE",
      "store-id": "TEST_STORE",
      "merchant-id": "TEST_MERCHANT",
      latitude: -1,
      longitude: -1,
    },
  };

  it("CartHeader renders correctly", () => {
    const tree = renderer.create(<CartHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
