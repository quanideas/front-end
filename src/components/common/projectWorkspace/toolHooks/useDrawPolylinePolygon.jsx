"use client";
import { useEffect, useState, useRef } from "react";
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  CallbackProperty,
  PolygonHierarchy,
  Color,
  ColorMaterialProperty,
  HeightReference,
} from "cesium";

/**
 * Custom hook for drawing polylines and polygons in a Cesium viewer.
 *
 * @param {Object} viewerRef - Reference to the Cesium viewer.
 * @param {string} mode - Mode of the drawing tool, either "line" or "polygon".
 * @returns {Object} - An object containing the drawn entities and the current mode.
 */
function useDrawPolylinePolygon(viewerRef, mode) {
  const activeShapePoints = useRef([]);
  const [entities, setEntities] = useState([]);
  const handlerRef = useRef();

  useEffect(() => {
    if (!viewerRef.current || (mode !== "line" && mode !== "polygon")) return;

    const viewer = viewerRef.current;

    let floatingPoint;
    let activeShape;

    /**
     * Creates a point entity at the given world position.
     *
     * @param {Cartesian3} worldPosition - The position of the point in the world.
     * @returns {Entity} - The created point entity.
     */
    const createPoint = (worldPosition) => {
      return viewer.entities.add({
        position: worldPosition,
        point: {
          color: Color.RED,
          pixelSize: 5,
          heightReference: HeightReference.NONE,
          depthFailMaterial: new ColorMaterialProperty(Color.YELLOW.withAlpha(0.5)),
        },
      });
    };

    /**
     * Draws a shape (polyline or polygon) based on the given position data.
     *
     * @param {Array|CallbackProperty} positionData - The positions or hierarchy of the shape.
     * @returns {Entity} - The created shape entity.
     */
    const drawShape = (positionData) => {
      if (mode === "line") {
        return viewer.entities.add({
          polyline: {
            positions: positionData,
            clampToGround: false,
            width: 1.5,
            material: Color.YELLOW,
            height: 100,
            depthFailMaterial: new ColorMaterialProperty(Color.YELLOW.withAlpha(0.5)),
          },
        });
      } else if (mode === "polygon") {
        return viewer.entities.add({
          polygon: {
            hierarchy: positionData,
            material: new ColorMaterialProperty(Color.WHITE.withAlpha(0.7)),
          },
        });
      }
    };

    /**
     * Terminates the current shape drawing, finalizing the shape and resetting the state.
     */
    const terminateShape = () => {
      if (activeShape) {
        viewer.entities.remove(activeShape);
      }
      if (floatingPoint) {
        viewer.entities.remove(floatingPoint);
      }
      if (activeShapePoints.current.length > 1) {
        const finalShape = drawShape(activeShapePoints.current.slice());
        setEntities((prev) => [...prev, finalShape]);
      }
      activeShapePoints.current = [];
      activeShape = null;
      floatingPoint = null;
    };

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    // Start drawing with the first click
    handler.setInputAction((event) => {
      const earthPosition = viewer.scene.pickPosition(event.position);
      if (earthPosition) {
        if (activeShapePoints.current.length === 0) {
          // Create a floating point
          floatingPoint = createPoint(earthPosition);
          activeShapePoints.current.push(earthPosition);

          // Draw dynamic line or polygon
          const dynamicPositions = new CallbackProperty(() => {
            if (mode === "polygon") {
              return new PolygonHierarchy(activeShapePoints.current);
            }
            return activeShapePoints.current;
          }, false);

          activeShape = drawShape(dynamicPositions);
        }
        // Add new point
        activeShapePoints.current.push(earthPosition);
        createPoint(earthPosition);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Update floating point position on mouse move
    handler.setInputAction((event) => {
      const newPosition = viewer.scene.pickPosition(event.endPosition);
      if (newPosition && floatingPoint) {
        floatingPoint.position.setValue(newPosition);

        // Update the last point in the list of points
        if (activeShapePoints.current.length > 0) {
          activeShapePoints.current[activeShapePoints.current.length - 1] = newPosition;
        }
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // Terminate drawing on right click
    handler.setInputAction(() => {
      // Remove the temporary last point before terminating
      if (floatingPoint) {
        activeShapePoints.current.pop(); // Remove the temporary last point
      }
      terminateShape();
    }, ScreenSpaceEventType.RIGHT_CLICK);

    handlerRef.current = handler;

    return () => {
      handler.destroy();
      handlerRef.current = null;
    };
  }, [viewerRef, mode]);

  return { entities, mode };
}

export default useDrawPolylinePolygon;