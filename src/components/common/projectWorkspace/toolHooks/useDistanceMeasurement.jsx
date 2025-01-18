"use client";
import { useEffect, useState } from "react";
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian3,
  LabelStyle,
  Color,
  VerticalOrigin,
  Cartesian2,
  HeightReference,
  ColorMaterialProperty,
} from "cesium";

/**
 * Custom hook for measuring distance between two points in a Cesium viewer.
 *
 * @param {Object} viewerRef - Reference to the Cesium viewer.
 * @param {string} mode - Mode of the tool, should be "distance" to activate this hook.
 * @returns {Object} - An object containing the state of the measurement.
 */
const useDistanceMeasurement = (viewerRef, mode) => {
  const [points, setPoints] = useState([]);
  const [distanceLabel, setDistanceLabel] = useState(null);
  const [tempLine, setTempLine] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [finalLine, setFinalLine] = useState(null);

  useEffect(() => {
    if (!viewerRef.current || mode !== "distance") return;

    const viewer = viewerRef.current;
    const handler = new ScreenSpaceEventHandler(viewer.canvas);

    // Mouse click event to select start or end point
    handler.setInputAction((click) => {
      const cartesian = viewer.scene.pickPosition(click.position);

      if (cartesian) {
        setPoints((prevPoints) => {
          const newPoints = [...prevPoints, cartesian];

          if (newPoints.length === 1) {
            // Create a red point at the start position
            const pointEntity = viewer.entities.add({
              position: cartesian,
              point: {
                pixelSize: 5,
                color: Color.RED,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
            });
            setStartPoint(pointEntity);
          }

          if (newPoints.length === 2) {
            // Calculate distance and draw a line between two points
            const distance = Cartesian3.distance(newPoints[0], newPoints[1]);

            // Remove old label if exists
            if (distanceLabel) {
              viewer.entities.remove(distanceLabel);
            }

            // Create a label to display the distance
            const label = viewer.entities.add({
              position: Cartesian3.midpoint(newPoints[0], newPoints[1], new Cartesian3()),
              label: {
                text: `${distance.toFixed(2)} meters`,
                font: "20px 'Material Icons'",
                fillColor: Color.YELLOW,
                style: LabelStyle.FILL,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(0, -20),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              },
            });
            setDistanceLabel(label);

            // Draw a polyline between two points
            const polyline = viewer.entities.add({
              polyline: {
                positions: newPoints,
                width: 0.5,
                material: Color.YELLOW,
                height: 100,
                depthFailMaterial: new ColorMaterialProperty(Color.YELLOW.withAlpha(0.5)),
              },
            });
            setFinalLine(polyline);

            // Create a point at the end position
            const endPointEntity = viewer.entities.add({
              position: newPoints[1],
              point: {
                pixelSize: 5,
                color: Color.RED,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
            });
            setEndPoint(endPointEntity);

            // Remove temporary line when completed
            if (tempLine) {
              viewer.entities.remove(tempLine);
              setTempLine(null);
            }
            return []; // Reset points to allow new measurements
          }

          return newPoints;
        });
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Mouse move event to draw a temporary line from start point to mouse position
    handler.setInputAction((movement) => {
      if (points.length === 1) {
        const endCartesian = viewer.scene.pickPosition(movement.endPosition);
        if (endCartesian) {
          // Remove existing temporary line before adding a new one
          if (tempLine) {
            viewer.entities.remove(tempLine);
          }

          // Create a temporary line
          const polyline = viewer.entities.add({
            polyline: {
              positions: [points[0], endCartesian],
              width: 2,
              material: Color.YELLOW,
              height: 100,
              depthFailMaterial: new ColorMaterialProperty(Color.YELLOW.withAlpha(0.5)),
            },
          });
          setTempLine(polyline);
        }
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // Cleanup when component unmounts or mode changes
    return () => {
      handler.destroy();
      setPoints([]);
      if (distanceLabel) {
        viewer.entities.remove(distanceLabel);
        setDistanceLabel(null);
      }
      if (tempLine) {
        viewer.entities.remove(tempLine);
        setTempLine(null);
      }
      if (startPoint) {
        viewer.entities.remove(startPoint);
        setStartPoint(null);
      }
      if (endPoint) {
        viewer.entities.remove(endPoint);
        setEndPoint(null);
      }
      if (finalLine) {
        viewer.entities.remove(finalLine);
        setFinalLine(null);
      }
    };
  }, [viewerRef, mode]); // Only watch viewerRef and mode, not other state.

  return { points, distanceLabel, tempLine, startPoint, endPoint, finalLine };
};

export default useDistanceMeasurement;