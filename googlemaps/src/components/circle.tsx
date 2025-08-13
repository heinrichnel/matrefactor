import { useEffect, useMemo, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

type CircleEvent =
  | "click"
  | "dblclick"
  | "drag"
  | "dragend"
  | "dragstart"
  | "mousedown"
  | "mousemove"
  | "mouseout"
  | "mouseover"
  | "mouseup"
  | "rightclick"
  | "radius_changed"
  | "center_changed";

type CircleHandlers = Partial<
  Record<CircleEvent, (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => void>
>;

export type CircleProps = {
  center: google.maps.LatLng | google.maps.LatLngLiteral | null;
  radius: number;

  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  fillColor?: string;
  fillOpacity?: number;

  onClick?: CircleHandlers["click"];
  onDblclick?: CircleHandlers["dblclick"];
  onDrag?: CircleHandlers["drag"];
  onDragend?: CircleHandlers["dragend"];
  onDragstart?: CircleHandlers["dragstart"];
  onMousedown?: CircleHandlers["mousedown"];
  onMousemove?: CircleHandlers["mousemove"];
  onMouseout?: CircleHandlers["mouseout"];
  onMouseover?: CircleHandlers["mouseover"];
  onMouseup?: CircleHandlers["mouseup"];
  onRightclick?: CircleHandlers["rightclick"];
};

const EVENT_MAP: ReadonlyArray<[CircleEvent, keyof CircleProps]> = [
  ["click", "onClick"],
  ["dblclick", "onDblclick"],
  ["drag", "onDrag"],
  ["dragend", "onDragend"],
  ["dragstart", "onDragstart"],
  ["mousedown", "onMousedown"],
  ["mousemove", "onMousemove"],
  ["mouseout", "onMouseout"],
  ["mouseover", "onMouseover"],
  ["mouseup", "onMouseup"],
  ["rightclick", "onRightclick"],
];

export function Circle(props: CircleProps) {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const options = useMemo<google.maps.CircleOptions>(
    () => ({
      center: props.center || undefined,
      radius: props.radius,
      strokeColor: props.strokeColor,
      strokeOpacity: props.strokeOpacity,
      strokeWeight: props.strokeWeight,
      fillColor: props.fillColor,
      fillOpacity: props.fillOpacity,
      clickable: true,
      draggable: false,
      editable: false,
    }),
    [
      props.center,
      props.radius,
      props.strokeColor,
      props.strokeOpacity,
      props.strokeWeight,
      props.fillColor,
      props.fillOpacity,
    ]
  );

  // Create / destroy Circle
  useEffect(() => {
    if (!map || !options.center) return;

    const circle = new google.maps.Circle({ ...options, map });
    circleRef.current = circle;

    return () => {
      listenersRef.current.forEach((l) => l.remove());
      listenersRef.current = [];
      circle.setMap(null);
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, !!options.center]);

  // Update options
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.setOptions(options);
  }, [options]);

  // Wire events (typed)
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    // remove old
    listenersRef.current.forEach((l) => l.remove());
    listenersRef.current = [];

    const gme = google.maps.event;

    EVENT_MAP.forEach(([eventName, propKey]) => {
      const handler = props[propKey] as
        | ((e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => void)
        | undefined;
      if (!handler) return;

      const listener = gme.addListener(
        circle,
        eventName,
        (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => handler(e)
      );
      listenersRef.current.push(listener);
    });
  }, [props]);

  return null;
}

export default Circle;
