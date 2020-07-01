import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import UserHeader from "./UserHeader";
import Header from "src/components/Header";
import { deepHtmlStringMatch } from "src/utils";

Enzyme.configure({ adapter: new Adapter() });

describe("UserHeader Component Tests", () => {
  const props = {
    user: {
      name: "TEST_USER",
      "user-id": "TEST",
    },
  };

  it("UserHeader renders correctly", () => {
    const tree = renderer.create(<UserHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("UserHeader displays user name in title", () => {
    const wrapper = Enzyme.shallow(<UserHeader {...props} />);
    const headerElement = wrapper.find(Header);
    const userInfoProp = headerElement.prop("title");
    const stringToMatch = props.user.name;
    expect(deepHtmlStringMatch(userInfoProp, stringToMatch)).toBe(true);
  });
});
