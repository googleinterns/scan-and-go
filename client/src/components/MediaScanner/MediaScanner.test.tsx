import React from "react";
import { waitFor } from "@testing-library/react";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MediaScanner from "./MediaScanner";
import { Button } from "@material-ui/core";

Enzyme.configure({ adapter: new Adapter() });

describe("MediaScanner Component Tests", () => {
  const mockScannerResultCallback = jest.fn();
  const TEST_BARCODE_STRING = "data:image/png;base64,helloworld";
  const props = {
    button: <Button id="TEST_SCAN">TEST SCAN</Button>,
    resultCallback: mockScannerResultCallback,
    debugFallbackImg: TEST_BARCODE_STRING,
  };

  it("MediaScanner renders correctly", () => {
    const tree = renderer.create(<MediaScanner {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("MediaScanner loads sample image given fallback", () => {
    const wrapper = Enzyme.mount(<MediaScanner {...props} />);
    const debugImg = wrapper.find("#media-img-debug").last();
    expect(debugImg.prop("src")).toEqual(TEST_BARCODE_STRING);
  });

  it("MediaScanner calls library to scan sample barcode", async () => {
    // Attaching to 'document.body' to allow for
    // 'document.getElementById' to work in MediaScanner
    // for finding the img element to paass to Barcode Library
    const wrapper = Enzyme.mount(<MediaScanner {...props} />, {
      attachTo: document.body,
    });
    const btns = wrapper.find(Button);
    expect(btns).toHaveLength(1);
    const scanBtn = btns.last();
    scanBtn.simulate("click");
    await waitFor(() =>
      expect(mockScannerResultCallback).toBeCalledWith(TEST_BARCODE_STRING)
    );
  });
});
