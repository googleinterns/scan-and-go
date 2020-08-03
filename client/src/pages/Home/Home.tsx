import React, { useEffect, useState, useContext } from "react";
import { withRouter, useHistory } from "react-router-dom";
import StoreList from "src/components/StoreList";
import UserHeader from "src/components/UserHeader";
import DebugBar from "./DebugBar";
import PlaceholderStoreList from "src/components/PlaceholderStoreList";
import IconSearchBar from "src/components/IconSearchBar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LocationOffIcon from "@material-ui/icons/LocationOff";
import { useTheme } from "@material-ui/core/styles";
import { Store, GMapPlace, GeoLocation } from "src/interfaces";
import {
  getGeoLocation,
  getStoresByLocation,
  getNearbyPlacesTest,
  getStoreRedirectUrl,
} from "src/pages/Actions";
import { Typography } from "@material-ui/core";
import { isWeb, isDebug, google } from "src/config";
import { transformGMapPlaceToStore } from "src/transforms";
import { parseUrlParam } from "src/utils";
import { AuthContext } from "src/contexts/AuthContext";

function Home(props: any) {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(false);
  const [testPlaces, setTestPlaces] = useState<GMapPlace[]>([]);
  const [placeStores, setPlaceStores] = useState<Store[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [curGeoLocation, setCurGeoLocation] = useState<GeoLocation | null>(
    null
  );
  const theme = useTheme();
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
  };

  const scanStoreQRCallback = (storeUrl: string) => {
    // Try to extract store-id and merchant-id fields from storeUrl
    const storeUrlArglist = storeUrl.split("?");
    if (storeUrlArglist.length !== 2) {
      //TODO(#65) Let user know that QR is malformed
      // in this case, no url parameters detected
      return;
    }
    // A correctly formed url will only contain 1 '?' character
    // hence split will be array of length 2 always
    const trimmedStoreUrl = storeUrlArglist[1];
    const storeId = parseUrlParam(trimmedStoreUrl, "id"); //TODO(#167) Replace with constants for "id"/"mid"
    const merchantId = parseUrlParam(trimmedStoreUrl, "mid");
    // If valid extraction, push us to new site
    if (storeId && merchantId) {
      history.push(getStoreRedirectUrl(storeId, merchantId));
    } else {
      //TODO(#65) Let user know that QR is malformed
    }
  };

  useEffect(() => {
    if (props.location.state) {
      setStores(props.location.state.stores);
    }
  }, []);

  useEffect(() => {
    if (curGeoLocation) {
      getStoresByLocation(curGeoLocation).then((res: any) => {
        setStores(res);
        setLoadingStores(false);
      });
    }
  }, [curGeoLocation]);

  useEffect(() => {
    //TODO(#127): Update when resolved and remove testPlaces/placeStores
    //            when functionality is built into backend server /store/list
    setPlaceStores(testPlaces.map((place) => transformGMapPlaceToStore(place)));
  }, [testPlaces]);

  return (
    <div className="Home">
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
        <Typography style={{ paddingTop: theme.spacing(1) }} variant="body2">
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
