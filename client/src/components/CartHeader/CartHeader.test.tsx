import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CartHeader from "./CartHeader";
import Header from "src/components/Header";
import { Button } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

describe("CartHeader Component Tests", () => {
  const mockedScanBarcode = jest.fn();
  const props = {
    store: {
      name: "TEST_STORE",
      "store-id": "TEST_STORE",
      "merchant-id": "TEST_MERCHANT",
      latitude: -1,
      longitude: -1,
    },
    scanBarcodeCallback: mockedScanBarcode,
  };

  it("CartHeader renders correctly", () => {
    const tree = renderer.create(<CartHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("CartHeader displays Store information in subtitle", () => {
    const wrapper = Enzyme.shallow(<CartHeader {...props} />);
    const headerElement = wrapper.find(Header);
    const storeInfoProp = headerElement.prop("subtitle");
    expect(storeInfoProp.props.children).toContain(props.store.name);
  });

  it("CartHeader has button and triggers scan barcode callback", async () => {
    const wrapper = Enzyme.mount(<CartHeader {...props} />);
    const buttons = wrapper.find(Button);
    expect(buttons).toHaveLength(1);
    const scanButton = buttons.last();
    scanButton.simulate("click");
    // We require waitFor to wait for effect hooks to trigger in <MediaScanner />
    await waitFor(() => expect(mockedScanBarcode).toHaveBeenCalled());
  });
});
