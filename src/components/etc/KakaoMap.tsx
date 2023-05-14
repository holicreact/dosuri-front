import styled from "@emotion/styled";
import { FC, useEffect, useState } from "react";
import { getLocationByCoordinate } from "@/service/apis/location";
import { KakaoMapViewLocation } from "@/types/service";
import { Location } from "@/types/location";
import { useRecoilState } from "recoil";
import { locationState } from "../domain/Address/store";
import { 강남구청 } from "@/constants/Location";

declare global {
  interface Window {
    kakao: any;
  }
}

interface IMapProps {
  locationInfo: KakaoMapViewLocation;
  setLocationInfo: (value: KakaoMapViewLocation) => void;
  coordinates: Location;
  loaded: boolean;
  isValidAddress: boolean;
  setIsValidAddress: (value: boolean) => void;
  mapRef: any;
  markersRef: any;
  deleteMarkers: () => void;
  showMarkers: () => void;
  mapCenter: Location;
  setMapCenter: (val: Location) => void;
}

const emptyAddress = {
  address: {
    address_name: "",
    region_1depth_name: "",
    region_2depth_name: "",
    region_3depth_name: "",
    mountain_yn: "",
    main_address_no: "",
    sub_address_no: "",
  },
  road_address: {
    address_name: "",
    region_1depth_name: "",
    region_2depth_name: "",
    region_3depth_name: "",
    road_name: "",
    underground_yn: "",
    main_building_no: "",
    sub_building_no: "",
    building_name: "",
  },
  latitude: 0,
  longitude: 0,
};

const KakaoMap: FC<IMapProps> = ({
  coordinates,
  setLocationInfo,
  loaded,
  isValidAddress,
  setIsValidAddress,
  mapRef,
  markersRef,
  deleteMarkers,
  showMarkers,
  mapCenter,
  setMapCenter,
}) => {
  const [location, setLocation] = useRecoilState(locationState);

  const getInitialCenter = () => {
    if (!loaded) {
      return 강남구청;
    }

    console.log(location);
    console.log(mapCenter);

    if (location.longitude !== 0 && location.latitude !== 0) {
      return {
        latitude: location!.latitude,
        longitude: location!.longitude,
      };
    } else {
      if (mapCenter.longitude === 0 && mapCenter.latitude === 0) {
        return {
          latitude: coordinates!.latitude,
          longitude: coordinates!.longitude,
        };
      } else {
        return {
          latitude: mapCenter!.latitude,
          longitude: mapCenter!.longitude,
        };
      }
    }
  };

  // 중심 좌표가 바뀔 때마다 주소를 가져온다.
  useEffect(() => {
    const { latitude, longitude } = getInitialCenter();

    const fetchLocation = async () => {
      const data = await getLocationByCoordinate({
        longitude: longitude,
        latitude: latitude,
      });

      isValidAddress = data.documents.length > 0;

      setIsValidAddress(isValidAddress);
      if (isValidAddress) {
        setLocationInfo({
          address: data.documents[0].address,
          road_address: data.documents[0].road_address,
          latitude,
          longitude,
        });
      } else {
        setLocationInfo(emptyAddress);
      }

      return data.documents;
    };
    fetchLocation();
  }, [mapCenter]);

  // 카카오맵 이니셜라이징 및 마커 이벤트 등록
  useEffect(() => {
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
          return;
        }

        const { latitude, longitude } = getInitialCenter();
        const initialCenter = new window.kakao.maps.LatLng(latitude, longitude);

        const mapOption = {
          center: initialCenter,
          level: 3, // 지도의 확대 레벨
        };

        // 마커를 생성합니다
        const marker = new window.kakao.maps.Marker({
          position: initialCenter,
        });

        // markersRef.current = [];

        // let markers: kakao.maps.Marker[] = [];
        markersRef.current.push(marker);
        mapRef.current = new window.kakao.maps.Map(mapContainer!, mapOption);
        showMarkers();
        // markers.forEach(
        //   (marker) => marker.setMap(mapRef.current) // 지도 위에 마커를 표출합니다
        // );

        // 지도 드래그 이벤트 발생 시 마커를 지우고 새로 생성한다.
        kakao.maps.event.addListener(mapRef.current, "drag", function () {
          deleteMarkers();
          markersRef.current = [];
          // 지도 중심좌표를 얻어옵니다
          const latlng = mapRef.current.getCenter();
          setMapCenter({
            latitude: latlng.getLat(),
            longitude: latlng.getLng(),
          });

          const markerPosition = new window.kakao.maps.LatLng(
            latlng.getLat(),
            latlng.getLng()
          );

          // 마커를 생성합니다
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          markersRef.current.push(marker);
          showMarkers();
        });
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);
  }, [coordinates]);

  return <MapWrapper id="map" />;
};

export default KakaoMap;

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
`;
