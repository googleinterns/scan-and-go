import React, { useEffect, useState, useContext } from "react";
import { withRouter, useHistory } from "react-router-dom";
import StoreList from "src/components/StoreList";
import TextInputField from "src/components/TextInputField";
import UserHeader from "src/components/UserHeader";
import DebugBar from "./DebugBar";
import PlaceholderStoreList from "src/components/PlaceholderStoreList";
import IconSearchBar from "src/components/IconSearchBar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LocationOffIcon from "@material-ui/icons/LocationOff";
import { SCANSTORE_PAGE } from "src/constants";
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
import { parseUrlParam } from "src/utils";
import { AuthContext } from "src/contexts/AuthContext";

function Home(props: any) {
  const { user, setUser } = useContext(AuthContext);
  const [userid, setUserid] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(false);
  const [testPlaces, setTestPlaces] = useState<GMapPlace[]>([]);
  const [placeStores, setPlaceStores] = useState<Store[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [curGeoLocation, setCurGeoLocation] = useState<GeoLocation | null>(
    null
  );
  const history = useHistory();

  const SECRET_TRIGGER = "hungry";

  const updateSearchText = (text: string) => {
    //TODO(#10) Attach search bar to search stores API endpoint
  };

  const readySearchText = (text: string) => {
    // Testing trigger with searching nearby restaurants with Places API
    //TODO(#131): Replace with server call for nearby stores when implemented
    if (text === SECRET_TRIGGER && curGeoLocation) {
      //TODO(#127): Update testing for fetching nearby places
      setLoadingStores(true);
      getNearbyPlacesTest(curGeoLocation, (places: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setTestPlaces(places);
          setLoadingStores(false);
        }
      });
    }
  };

  const grabLocation = (state: boolean) => {
    setUseLocation(state);
    setLoadingLocation(state);
    setLoadingStores(state);
    if (state) {
      getGeoLocation(locationSuccessCallback, () => {
        setUseLocation(false);
        setLoadingLocation(false);
        setLoadingStores(false);
      });
    } else {
      // Clear search results?
      setStores([]);
      setPlaceStores([]);
    }
  };

  const locationSuccessCallback = (position: GeoLocation) => {
    setCurGeoLocation(position);
    setLoadingLocation(false);
    setLoadingStores(false);
  };

  const scanStoreQRCallback = (storeUrl: string) => {
    // Try to extract store-id and merchant-id fields from storeUrl
    const storeId = parseUrlParam(storeUrl, "id"); //TODO(#167) Replace with constants for "id"/"mid"
    const merchantId = parseUrlParam(storeUrl, "mid");
    // If valid extraction, push us to new site
    if (storeId && merchantId) {
      history.push(SCANSTORE_PAGE + "?id=" + storeId + "&mid=" + merchantId);
    } else {
      //TODO(#65) Let user know that QR is malformed
    }
  };

  useEffect(() => {
    // Initially set user based on passed props
    if (props.location.state) {
      setUser(props.location.state.user);
      setStores(props.location.state.stores);
    }
  }, []);

  useEffect(() => {
    if (curGeoLocation) {
      setLoadingStores(true);
      getStoresByLocation(curGeoLocation).then((res: any) => {
        setStores(res);
        setLoadingStores(false);
      });
    }
  }, [curGeoLocation]);

  useEffect(() => {
    if (userid) {
      getUserInfo(userid).then((res) => setUser(res));
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
      <UserHeader user={user} scanStoreQRCallback={scanStoreQRCallback} />
      {isDebug && (
        <DebugBar storesCallback={setStores} placesCallback={setTestPlaces} />
      )}
      <IconSearchBar
        iconCallback={grabLocation}
        onChangeCallback={updateSearchText}
        onSubmitCallback={readySearchText}
        isLoading={loadingLocation}
        icon={[<LocationOnIcon color="primary" />, <LocationOffIcon />]}
      />
      {!useLocation && (
        <Typography variant="body2">
          Turn on location for suggested nearby places!
        </Typography>
      )}
      <StoreList stores={stores} />
      <StoreList stores={placeStores} />
      {loadingStores && <PlaceholderStoreList length={6} />}
    </div>
  );
}

export default withRouter(Home);
