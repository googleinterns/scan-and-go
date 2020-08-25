import React from "react";
import renderer from "react-test-renderer";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Home from "./Home";
import { BrowserRouter as Router } from "react-router-dom";
import { emptyStore, Store } from "src/interfaces";
import * as Actions from "../Actions";
import StoreCard from "src/components/StoreCard";
import { waitFor, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";

Enzyme.configure({ adapter: new Adapter() });

it("Home Page renders correctly", async () => {
  let tree;
  await renderer.act(async () => {
    tree = renderer
      .create(
        <Router>
          <Home />
        </Router>
      )
      .toJSON();
  });
  expect(tree).toMatchSnapshot();
});

describe("Test store search feature", () => {
  const testStores: Store[] = [
    Object.assign(emptyStore(), {
      "store-id": "0",
      preprocessedName: "Store A",
    }),
    Object.assign(emptyStore(), {
      "store-id": "1",
      preprocessedName: "Store Ab",
    }),
    Object.assign(emptyStore(), {
      "store-id": "2",
      preprocessedName: "Mart A",
    }),
  ];
  jest
    .spyOn(Actions, "getAllStores")
    .mockReturnValue(new Promise((resolve, _) => resolve(testStores)));
  const storeSearchStub = jest.spyOn(Actions, "getSimilarStores");

  let container: any = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    container.setAttribute("id", "app");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it("calls getSimilarStores when the user submits a query", async () => {
    const query = "Store Ab";

    // Mount the component and wait for state to update
    let wrapper: Enzyme.ReactWrapper;
    await act(async () => {
      wrapper = Enzyme.mount(
        <Router>
          <Home />
        </Router>,
        { attachTo: container }
      );
    });
    expect(Actions.getAllStores).toBeCalled();

    // "Submit" store search query
    // Need to access input field within Material UI component https://stackoverflow.com/questions/57110557/react-testing-library-the-given-element-does-not-have-a-value-setter-when-firee
    const input = container
      .getElementsByClassName("DebugBar")[0]
      .firstElementChild.querySelector("input");
    // Need to use fireEvent https://github.com/testing-library/react-testing-library/issues/543
    fireEvent.blur(input, { target: { value: query } });
    expect(storeSearchStub).toBeCalledWith(query, testStores);
  });

  it("renders store cards corresponding to the stores returned by getSimilarStores", async () => {
    const query = "Store Ab";
    const expectedStores: Store[] = Actions.getSimilarStores(query, testStores);
    expect(expectedStores.length).toBeGreaterThan(0); // we want this test to be non-trivial

    // Mount the component and wait for state to update
    let wrapper: Enzyme.ReactWrapper;
    await act(async () => {
      wrapper = Enzyme.mount(
        <Router>
          <Home />
        </Router>,
        { attachTo: container }
      );
    });

    // "Submit" store search query
    const input = container
      .getElementsByClassName("DebugBar")[0]
      .firstElementChild.querySelector("input");
    fireEvent.blur(input, { target: { value: query } });
    expect(storeSearchStub).toReturnWith(expectedStores);

    // Force wrapper to update props cache of child wrappers
    // https://github.com/enzymejs/enzyme/issues/1323
    wrapper!.update();

    // Check store cards
    await waitFor(() => {
      const storeCards = wrapper!.find(StoreCard);
      expect(storeCards.length).toEqual(expectedStores.length);
      storeCards.forEach((storeCard, i) => {
        expect(storeCard.prop("store")).toEqual(expectedStores[i]);
      });
    });
  });
});
