import { GMapPlace, Store, emptyStore } from "src/interfaces";
import { MAX_CARD_HEIGHT } from "src/components/StoreCard/StoreCard";
console.log(MAX_CARD_HEIGHT);

// Transform GMapPlace response to Store interface for display
export const transformGMapPlaceToStore = (gMapPlace: GMapPlace): Store => {
  const newStore = emptyStore();
  console.log(gMapPlace);
  newStore["store-id"] = gMapPlace.place_id;
  newStore["merchant-id"] = "GOOGLEMAPS"; //TODO(#114) We store an associative mapping?
  newStore.name = gMapPlace.name;
  newStore.latitude = gMapPlace.geometry.location.lat();
  newStore.longitude = gMapPlace.geometry.location.lng();
  newStore.business_status = gMapPlace.business_status;
  newStore.vicinity = gMapPlace.vicinity;
  // Decide whether the place we retrieved has a valid photo field
  newStore.media = gMapPlace.icon; // Default to icon (always returned)
  if (gMapPlace.photos && gMapPlace.photos.length > 0) {
    newStore.media = gMapPlace.photos[0].getUrl({ maxHeight: MAX_CARD_HEIGHT });
  }
  return newStore;
};
