import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CartSummary from "./CartSummary";

Enzyme.configure({ adapter: new Adapter() });

describe("CartSummary Component Tests", () => {
  const props = {};

  it("CartSummary renders correctly", () => {
    const tree = renderer.create(<CartSummary {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
