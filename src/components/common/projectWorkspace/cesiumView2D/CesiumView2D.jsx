"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Toolbar from "@/components/common/projectWorkspace/toolBar/ToolBar";
import { getData } from '@/components/utils/UploadDownloadApi';

import { Ion, Viewer, GeoJsonDataSource, Color, TileMapServiceImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOWNLOAD_UPLOAD_URL;
const END_POINT = "/project";

const CesiumMap = ({ urlGeoJson, urlImagery }) => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const dataSourceRef = useRef(null);

  const [mode, setMode] = useState(null);
  const [geoJsonColor, setGeoJsonColor] = useState(Color.RED);
  const [geoJsonOpacity, setGeoJsonOpacity] = useState(0.5);

  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return;

    Ion.defaultAccessToken = ACCESS_TOKEN;

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
  }, []);

  const initializeMap = useCallback(async () => {
    try {
      // Load GeoJSON if the urlGeoJson is provided
      if (urlGeoJson) {
        const finalUrlGeoJson = `${END_POINT}${urlGeoJson}/doc.geojson`;
        const resource = await getData(finalUrlGeoJson);
        const dataSource = await GeoJsonDataSource.load(resource);

        dataSource.entities.values.forEach((entity) => {
          if (entity.polygon) {
            entity.polygon.material = geoJsonColor.withAlpha(geoJsonOpacity);
          }
        });

        viewerRef.current.dataSources.add(dataSource);
        dataSourceRef.current = dataSource;

        if (!urlImagery) {
          // Zoom to the loaded GeoJSON data
          viewerRef.current.zoomTo(dataSource);
        }
      }


      // Load Imagery if the urlImagery is provided
      console.log("urlImagery", urlImagery);
      console.log("urlGeoJson", urlGeoJson);
      if (urlImagery) {
        const finalUrlImagery = `${API_BASE_URL}${END_POINT}${urlImagery}`;
        const imageryLayer = await TileMapServiceImageryProvider.fromUrl(
          finalUrlImagery,
        );

        viewerRef.current.imageryLayers.addImageryProvider(imageryLayer);
        // Zoom to the imagery layer's bounds
        const imageryRectangle = imageryLayer.rectangle;
        if (imageryRectangle) {
          viewerRef.current.camera.flyTo({
            destination: imageryRectangle,
            duration: 2, // duration in seconds
          });
        } else {
          console.warn("No bounding rectangle found for the imagery layer.");
        }
      }
    } catch (error) {
      console.error("Error initializing Cesium map:", error);
    }
  }, [geoJsonColor, geoJsonOpacity, urlGeoJson, urlImagery]);

  useEffect(() => {
    if (viewerRef.current) {
      initializeMap();
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [initializeMap]);

  return (
    <div className="relative w-full h-screen">
      <div ref={cesiumContainerRef} className="w-full h-full" />
      <Toolbar setMode={setMode} mode={mode} />
    </div>
  );
};

export default CesiumMap;
