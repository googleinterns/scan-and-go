import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ItemDetail from "./ItemDetail";

Enzyme.configure({ adapter: new Adapter() });

describe("ItemDetail Component Tests", () => {
  const props = {};

  it("ItemDetail renders correctly", () => {
    const tree = renderer.create(<ItemDetail {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
