import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import IconSearchBar from "./IconSearchBar";

Enzyme.configure({ adapter: new Adapter() });

describe("IconSearchBar Component Tests", () => {
  const iconClickCallback = jest.fn();
  const searchChangeCallback = jest.fn();
  const searchSubmitCallback = jest.fn();

  const props = {
    icon: [<div id="onIcon" />, <div id="offIcon" />],
    iconCallback: iconClickCallback,
    onChangeCallback: searchChangeCallback,
    onSubmitCallback: searchSubmitCallback,
  };

  const TEST_SEARCH_INPUT = "hello";

  it("IconSearchBar renders correctly", () => {
    const tree = renderer.create(<IconSearchBar {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("IconSearchBar renders correct icon on click", async () => {
    const wrapper = Enzyme.mount(<IconSearchBar {...props} />);
    // Expect default to render icon in 'Off' state
    expect(wrapper.find("#offIcon")).toHaveLength(1);
    // Expect to render icon in 'On' state after click
    const icon = wrapper.find("#icon-search-icon").last();
    icon.simulate("click");
    await waitFor(() => {
      expect(wrapper.find("#onIcon")).toHaveLength(1);
      expect(wrapper.find("#offIcon")).toHaveLength(0);
    });
  });

  it("IconSearchBar icon click calls attached callback", () => {
    const wrapper = Enzyme.mount(<IconSearchBar {...props} />);
    const icon = wrapper.find("#icon-search-icon").last();
    icon.simulate("click");
    // Expect first toggle to be 'true' ('false' -> 'true')
    expect(iconClickCallback).toBeCalledWith(true);
    icon.simulate("click");
    // Expect next toggle to be 'false'
    expect(iconClickCallback).toBeCalledWith(false);
  });

  it("IconSearchBar typing triggers onChange callback", () => {
    const wrapper = Enzyme.mount(<IconSearchBar {...props} />);
    const searchBar = wrapper.find("#icon-search-bar").last();
    searchBar.simulate("change", { target: { value: TEST_SEARCH_INPUT } });
    expect(searchChangeCallback).toBeCalledWith(TEST_SEARCH_INPUT);
  });

  it("IconSearchBar blur triggers Submit callback", () => {
    const wrapper = Enzyme.mount(<IconSearchBar {...props} />);
    const searchBar = wrapper.find("#icon-search-bar").last();
    searchBar.simulate("blur", { target: { value: TEST_SEARCH_INPUT } });
    expect(searchSubmitCallback).toBeCalledWith(TEST_SEARCH_INPUT);
  });

  //TODO(#183): ele = document.findElementById(); ele.blur(); does not trigger
});
