import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PlaceholderStoreList from "./PlaceholderStoreList";
import StorePlaceholder from "src/components/StorePlaceholder";

Enzyme.configure({ adapter: new Adapter() });

describe("PlaceholderStoreList Component Tests", () => {
  const TEST_LENGTH = 3;
  const props = {
    length: TEST_LENGTH,
  };

  it("PlaceholderStoreList renders correctly", () => {
    const tree = renderer.create(<PlaceholderStoreList {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("PlaceholderStoreList renders specified number of placeholders", () => {
    const wrapper = Enzyme.shallow(<PlaceholderStoreList {...props} />);
    expect(wrapper.find(StorePlaceholder)).toHaveLength(TEST_LENGTH);
  });
});
