import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import StoreList from "src/components/StoreList";
import TextInputField from "src/components/TextInputField";
import UserHeader from "src/components/UserHeader";
import DebugBar from "./DebugBar";
import IconSearchBar from "src/components/IconSearchBar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LocationOffIcon from "@material-ui/icons/LocationOff";
import { User, emptyUser, Store, GMapPlace, GeoLocation } from "src/interfaces";
import {
  getUserInfo,
  getGeoLocation,
  getStoresByLocation,
  getNearbyPlacesTest,
} from "src/pages/Actions";
import { Typography } from "@material-ui/core";
import { isWeb, isDebug, google } from "src/config";
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
    //TODO(#131): Replace with server call for nearby stores when implemented
    if (text === SECRET_TRIGGER && curGeoLocation) {
      //TODO(#127): Update testing for fetching nearby places
      getNearbyPlacesTest(curGeoLocation, (places: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setTestPlaces(places);
        }
      });
    }
  };

  const grabLocation = (state: boolean) => {
    setUseLocation(state);
    if (state) {
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
    //TODO(#127): Update when resolved and remove testPlaces/placeStores
    //            when functionality is built into backend server /store/list
    setPlaceStores(testPlaces.map((place) => transformGMapPlaceToStore(place)));
  }, [testPlaces]);

  return (
    <div className="Home">
      {isDebug && <TextInputField text={userid} setState={setUserid} />}
      <UserHeader user={curUser} />
      {isDebug && (
        <DebugBar storesCallback={setStores} placesCallback={setTestPlaces} />
      )}
      <IconSearchBar
        iconCallback={grabLocation}
        onChangeCallback={updateSearchText}
        onSubmitCallback={readySearchText}
        icon={[<LocationOnIcon color="primary" />, <LocationOffIcon />]}
      />
      {!useLocation && (
        <Typography variant="body2">
          Turn on location for suggested nearby places!
        </Typography>
      )}
      <StoreList stores={stores} />
      <StoreList stores={placeStores} />
    </div>
  );
}

export default withRouter(Home);
