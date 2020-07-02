import React, { useEffect, useState } from "react";
import { isWeb, microapps } from "src/config";
import { MediaResponse, emptyMediaResponse } from "src/interfaces";
import { processImageBarcode } from "src/utils";

function MediaScanner({
  button,
  resultCallback,
  debugFallbackImg,
}: {
  button: React.ReactElement;
  resultCallback: (barcode: string) => void;
  debugFallbackImg?: string;
}) {
  const [uploadedImg, setUploadedImg] = useState<MediaResponse>();

  const uploadedImgId = "media-img-upload";
  const debugImgId = "media-img-debug";

  const requestMediaUpload = async () => {
    if (isWeb) {
      scanBarcodeFromImage();
    } else {
      const imgReq = {
        allowedMimeTypes: ["image/jpeg"],
        allowedSources: ["camera"],
      };
      const imgRes = await microapps.requestMedia(imgReq);
      setUploadedImg(imgRes);
    }
  };

  const scanBarcodeFromImage = () => {
    let img = document.getElementById(uploadedImgId) as HTMLImageElement;
    // Try to fallback, else abort
    if (!img && debugFallbackImg) {
      img = document.getElementById(debugImgId) as HTMLImageElement;
    } else {
      return;
    }
    processImageBarcode(img).then((barcode: string) => {
      resultCallback(barcode);
    });
  };

  useEffect(() => {
    if (uploadedImg) {
      scanBarcodeFromImage();
    }
  }, [uploadedImg]);

  return (
    <div className="MediaScanner">
      {React.cloneElement(button, {
        onClick: requestMediaUpload,
      })}
      {uploadedImg && (
        <img
          hidden={true}
          id={uploadedImgId}
          src={"data:" + uploadedImg.mimeType + ";base64," + uploadedImg.bytes}
        />
      )}
      {debugFallbackImg && (
        <img hidden={true} id={debugImgId} src={debugFallbackImg} />
      )}
    </div>
  );
}

export default MediaScanner;
