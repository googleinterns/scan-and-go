import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import $NAME from "./$NAME";

Enzyme.configure({ adapter: new Adapter() });

describe("$NAME Component Tests", () => {
  const props = {};

  it("$NAME renders correctly", () => {
    const tree = renderer.create(<$NAME {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
