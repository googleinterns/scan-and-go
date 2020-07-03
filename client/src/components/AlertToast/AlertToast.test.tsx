import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AlertToast from "./AlertToast";
import { deepHtmlStringMatch } from "src/utils";
import { Button } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

describe("AlertToast Component Tests", () => {
  const mockedClose = jest.fn();
  const props = {
    content: <p id="test-content">Hello</p>,
    style: { severity: "success" },
    closeCallback: mockedClose,
  };

  //TODO(#171): react-test-renderer has trouble rendering <Alert />
  //            cannot "getboundingclientrect" of null issue
  //            apparently does not render child element?

  it("AlertToast renders message", () => {
    const wrapper = Enzyme.mount(<AlertToast {...props} />);
    const content = wrapper.find("#test-content").last();
    expect(deepHtmlStringMatch(content, "Hello"));
  });

  it("AlertToast calls close callback when closed", () => {
    const wrapper = Enzyme.mount(<AlertToast {...props} />);
    const closeBtn = wrapper.find({ type: "button", title: "Close" }).last();
    closeBtn.simulate("click");
    expect(mockedClose).toBeCalled();
  });
});
