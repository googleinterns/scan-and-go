import React from "react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import PlaceholderCart from "./PlaceholderCart";
import ItemPlaceholder from "src/components/ItemPlaceholder";

Enzyme.configure({ adapter: new Adapter() });

describe("PlaceholderCart Component Tests", () => {
  const TEST_LENGTH = 3;
  const props = {
    length: TEST_LENGTH,
  };

  it("PlaceholderCart renders correctly", () => {
    const tree = renderer.create(<PlaceholderCart {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("PlaceholderCart renders specified number of placeholders", () => {
    const wrapper = Enzyme.shallow(<PlaceholderCart {...props} />);
    expect(wrapper.find(ItemPlaceholder)).toHaveLength(TEST_LENGTH);
  });
});
