import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import StorePlaceholder from "./StorePlaceholder";

Enzyme.configure({ adapter: new Adapter() });

describe("StorePlaceholder Component Tests", () => {
  const props = {};

  it("StorePlaceholder renders correctly", () => {
    const tree = renderer.create(<StorePlaceholder {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
