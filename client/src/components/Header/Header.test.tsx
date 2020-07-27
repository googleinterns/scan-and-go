import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Header from "./Header";
import { HOME_PAGE } from "src/constants";

Enzyme.configure({ adapter: new Adapter() });

describe("Header Component Tests", () => {
  const mockedClick = jest.fn();
  const props = {
    title: <p id="test-title">TEST HEADER</p>,
    subtitle: <p id="test-subtitle">SUBTITLE</p>,
    button: (
      <button id="test-btn" onClick={mockedClick}>
        TEST BUTTON
      </button>
    ),
    content: <p id="test-content">PAYLOAD</p>,
    homeBtn: true,
  };

  it("Header renders correctly", () => {
    const tree = renderer.create(<Header {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Header renders components correctly", () => {
    const wrapper = Enzyme.shallow(<Header {...props} />);
    expect(wrapper.find("#test-title").last()).toHaveLength(1);
    expect(wrapper.find("#test-subtitle").last()).toHaveLength(1);
    expect(wrapper.find("#test-btn").last()).toHaveLength(1);
    expect(wrapper.find("#test-content").last()).toHaveLength(1);
  });

  it("Button runs onClick function", () => {
    const wrapper = Enzyme.shallow(<Header {...props} />);
    const headerButton = wrapper.find("#test-btn").last();
    headerButton.simulate("click");
    expect(mockedClick).toBeCalled();
  });

  it("Header has home button and redurects to home page", async () => {
    const wrapper = Enzyme.mount(<Header {...props} />);
    const homeButton = wrapper.find("#home-btn").last();
    homeButton.simulate("click");
    const pushArgs = global.mockRedirectPush.mock.calls.pop();
    expect(pushArgs[0]).toHaveProperty("pathname", HOME_PAGE);
  });
});
