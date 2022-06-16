import {
    useCallback,
    useRef,
} from 'react';

/**
 * Track the user's intended panning offset by listening to `mousemove` events
 * once the user has started panning.
 */
export default function usePan(origin) {
    const panRef = useRef(origin);

    // Track the last observed mouse position on pan.
    const lastPointRef = useRef(origin);

    const pan = useCallback((e, scale, minX, maxX, minY, maxY) => {
        const lastPoint = lastPointRef.current;
        const point = { x: e.pageX, y: e.pageY };
        lastPointRef.current = point;

        // Find the delta between the last mouse position on `mousemove` and the
        // current mouse position.
        //
        // Then, apply that delta to the current pan offset and set that as the new
        // state.
        const newPan = (prevPan) => {
            const delta = {
                x: lastPoint.x - point.x,
                y: lastPoint.y - point.y
            };

            const offsetX = (delta.x > 0 && prevPan.x < maxX) || (delta.x < 0 && prevPan.x > minX) ? (scale * delta.x) : 0;
            const offsetY = (delta.y < 0 && prevPan.y < maxY) || (delta.y > 0 && prevPan.y > minY) ? (scale * delta.y) : 0;

            const offset = {
                x: prevPan.x + offsetX,
                y: prevPan.y - offsetY
            };

            return offset;
        };

        panRef.current = newPan(panRef.current);
    }, []);

    // Tear down listeners.
    const endPan = useCallback((f) => {
        document.removeEventListener('mousemove', f);
        document.removeEventListener('mouseup', endPan);
    }, []);

    // Set up listeners.
    const startPan = useCallback((e, scale, minX, maxX, minY, maxY) => {
        const scaledPan = e => pan(e, scale, minX, maxX, minY, maxY);
        document.addEventListener('mousemove', scaledPan);
        document.addEventListener('mouseup', () => endPan(scaledPan));
        lastPointRef.current = { x: e.pageX, y: e.pageY };
    },
        [pan, endPan]
    );

    return [panRef, startPan];
}
