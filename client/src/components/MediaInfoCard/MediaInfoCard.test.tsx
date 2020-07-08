import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MediaInfoCard from "./MediaInfoCard";
import InfoCardMedia from "./InfoCardMedia";

Enzyme.configure({ adapter: new Adapter() });

describe("MediaInfoCard Component Tests", () => {
  const TEST_IMG_SRC = "data:testing!";
  const mockedClickCallback = jest.fn();

  const props = {
    media: TEST_IMG_SRC,
    title: <div id="title" />,
    content: <div id="content" />,
    rightColumn: <div id="rightColumn" />,
    onClick: mockedClickCallback,
  };

  it("MediaInfoCard renders correctly", () => {
    const tree = renderer.create(<MediaInfoCard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("MediaInfoCard renders specified sub-components", () => {
    const wrapper = Enzyme.shallow(<MediaInfoCard {...props} />);
    const title = wrapper.find("#title");
    const content = wrapper.find("#content");
    const rightColumn = wrapper.find("#rightColumn");
    expect(title).toHaveLength(1);
    expect(content).toHaveLength(1);
    expect(rightColumn).toHaveLength(1);
  });

  it("MediaInfoCard triggers click callback on click", () => {
    const wrapper = Enzyme.shallow(<MediaInfoCard {...props} />);
    wrapper.simulate("click");
    expect(mockedClickCallback).toBeCalled();
  });

  it("MediaInfoCard renders media sub-component", () => {
    const wrapper = Enzyme.mount(<MediaInfoCard {...props} />);
    const mediaWrapper = wrapper.find(InfoCardMedia);
    // Test that we have rendered a InfoCardMedia component
    expect(mediaWrapper).toHaveLength(1);
    // Expect there to be 1 <img> element
    const imgs = mediaWrapper.find("img");
    expect(imgs).toHaveLength(1);
    const imgElement = mediaWrapper.find("img").last();
    // Expect that in this img tag, we render source specified
    expect(imgElement.prop("src")).toEqual(TEST_IMG_SRC);
  });
});
