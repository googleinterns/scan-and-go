import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MediaInfoCard from "./MediaInfoCard";

Enzyme.configure({ adapter: new Adapter() });

describe("MediaInfoCard Component Tests", () => {
  const props = {};

  it("MediaInfoCard renders correctly", () => {
    const tree = renderer.create(<MediaInfoCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
