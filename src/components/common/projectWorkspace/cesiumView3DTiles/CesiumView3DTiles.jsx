"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Toolbar from "@/components/common/projectWorkspace/toolBar/ToolBar";
import { Ion, Viewer, Cesium3DTileset, Cartesian3, Math, TrustedServers } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import useDistanceMeasurement from "@/components/common/projectWorkspace/toolHooks/useDistanceMeasurement";
import useDrawPolylinePolygon from "@/components/common/projectWorkspace/toolHooks/useDrawPolylinePolygon";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOWNLOAD_UPLOAD_URL;
const TRUSTED_SERVICES_BASE_URL = process.env.NEXT_PUBLIC_TRUSTED_SERVICES_BASE_URL;
const END_POINT = "/project";

const CesiumMap = ({ url }) => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [mode, setMode] = useState(null);

  // Khởi tạo Cesium Viewer chỉ một lần khi component render lần đầu
  useEffect(() => {
    Ion.defaultAccessToken = ACCESS_TOKEN;

    if (!viewerRef.current) {
      const creditContainer = document.createElement("div");
      creditContainer.style.display = "none";
      const viewer = new Viewer(cesiumContainerRef.current, {
        animation: false,
        navigationHelpButton: false,
        timeline: false,
        homeButton: false,
        infoBox: false,
        creditContainer: creditContainer,
        geocoder: false,
      });

      viewerRef.current = viewer;
    }
  }, []);

  // Hàm tải và hiển thị dữ liệu tileset
  const initializeMap = useCallback(async () => {
    try {
      // Add trusted servers
      const trustedServers = TRUSTED_SERVICES_BASE_URL.split(",")
      for (const server of trustedServers) {
        const url = server.split(":")
        const host = url[0]
        const port = url[1]
        TrustedServers.add(host, port)
      }

      const finalUrl = `${API_BASE_URL}${END_POINT}${url}/tileset.json`;
      const isTrusted = TrustedServers.contains(finalUrl)
      console.log(`isTrusted: ${isTrusted}`)
      const tileset = await Cesium3DTileset.fromUrl(finalUrl);
      viewerRef.current.scene.primitives.add(tileset);

      // Đảm bảo tileset nằm ở trung tâm của view
      viewerRef.current.camera.flyTo({
        destination: tileset.boundingSphere.center,
        orientation: {
          heading: Math.toRadians(0.0),
          pitch: Math.toRadians(-90.0),
          roll: 0.0,
        },
        complete: () => {
          console.log('Camera flyTo complete');
        },
      });
    } catch (error) {
      console.error("Error initializing Cesium map:", error);
    }
  }, [url]);

  // Gọi hàm khởi tạo map mỗi khi component mount
  useEffect(() => {
    if (viewerRef.current) {
      initializeMap();
    }
  }, [initializeMap]);

  // Gọi custom hook đo khoảng cách
  useDistanceMeasurement(viewerRef, mode);
  // Khởi tạo hook để vẽ polyline
  useDrawPolylinePolygon(viewerRef, mode);

  return (
    <div className={`absolute w-full h-screen ${["distance", "line", "polygon"].includes(mode) ? "cursor-crosshair" : ""}`}>
      <div ref={cesiumContainerRef} className="w-full h-full" />
      <Toolbar setMode={setMode} mode={mode} />
    </div>
  ); 
};

export default CesiumMap;
