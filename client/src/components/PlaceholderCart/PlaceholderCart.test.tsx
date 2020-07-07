import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PlaceholderCart from "./PlaceholderCart";

Enzyme.configure({ adapter: new Adapter() });

describe("PlaceholderCart Component Tests", () => {
  const props = {};

  it("PlaceholderCart renders correctly", () => {
    const tree = renderer.create(<PlaceholderCart {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
