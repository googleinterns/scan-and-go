import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AlertToast from "./AlertToast";

Enzyme.configure({ adapter: new Adapter() });

describe("AlertToast Component Tests", () => {
  const props = {};

  it("AlertToast renders correctly", () => {
    const tree = renderer.create(<AlertToast {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
