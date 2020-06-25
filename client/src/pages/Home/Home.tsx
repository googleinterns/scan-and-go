import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import StoreList from "src/components/StoreList";
import TextInputField from "src/components/TextInputField";
import UserHeader from "src/components/UserHeader";
import DebugBar from "./DebugBar";
import SearchBar from "src/components/SearchBar";
import { User, emptyUser, Store, GMapPlace, GeoLocation } from "src/interfaces";
import {
  getUserInfo,
  getGeoLocation,
  getStoresByLocation,
  getNearbyPlacesTest,
} from "src/pages/Actions";
import { Container, Typography } from "@material-ui/core";
import { isDebug, google } from "src/config";
import { transformGMapPlaceToStore } from "src/transforms";

function Home(props: any) {
  const [userid, setUserid] = useState("");
  const [curUser, setCurUser] = useState<User>(emptyUser());
  const [stores, setStores] = useState<Store[]>([]);
  const [testPlaces, setTestPlaces] = useState<GMapPlace[]>([]);
  const [placeStores, setPlaceStores] = useState<Store[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [curGeoLocation, setCurGeoLocation] = useState<GeoLocation | null>(
    null
  );

  const SECRET_TRIGGER = "hungry";

  const updateSearchText = (text: string) => {
    //TODO(#10) Attach search bar to search stores API endpoint
  };

  const readySearchText = (text: string) => {
    // Testing trigger with searching nearby restaurants with Places API
    if (text === SECRET_TRIGGER && curGeoLocation) {
      getNearbyPlacesTest(curGeoLocation, (places: any, status: any) => {
        console.log(status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setTestPlaces(places);
        }
      });
    }
  };

  const grabLocation = (state: boolean) => {
    setUseLocation(state);
    if (state) {
      console.log("Attempt to trigger getStoresByLocation");
      getGeoLocation(locationSuccessCallback);
    } else {
      // Clear search results?
      setStores([]);
      setPlaceStores([]);
    }
  };

  const locationSuccessCallback = (position: GeoLocation) => {
    setCurGeoLocation(position);
  };

  useEffect(() => {
    // Initially set user based on passed props
    if (props.location.state) {
      setCurUser(props.location.state.user);
      setStores(props.location.state.stores);
    }
  }, []);

  useEffect(() => {
    if (curGeoLocation) {
      getStoresByLocation(curGeoLocation).then((res: any) => setStores(res));
    }
  }, [curGeoLocation]);

  useEffect(() => {
    if (userid) {
      getUserInfo(userid).then((res) => setCurUser(res));
    }
  }, [userid]);

  useEffect(() => {
    setPlaceStores(testPlaces.map((place) => transformGMapPlaceToStore(place)));
  }, [testPlaces]);

  return (
    <Container disableGutters={false} className="Home">
      {isDebug && <TextInputField text={userid} setState={setUserid} />}
      <UserHeader user={curUser} />
      {isDebug && (
        <DebugBar storesCallback={setStores} placesCallback={setTestPlaces} />
      )}
      <SearchBar
        iconCallback={grabLocation}
        onChangeCallback={updateSearchText}
        onEnterCallback={readySearchText}
      />
      {!useLocation && (
        <Typography variant="body2">
          Turn on location for suggested nearby places!
        </Typography>
      )}
      <StoreList stores={stores} />
      <StoreList stores={placeStores} />
    </Container>
  );
}

export default withRouter(Home);
