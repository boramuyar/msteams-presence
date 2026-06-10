const ACTIVITY_PULSE = "activity-pulse";
const MAX_COORDINATE_OFFSET = 8;

let pulseCount = 0;

function getPulseTarget(documentRef = globalThis.document) {
  if (!documentRef) {
    return null;
  }

  return documentRef.body || documentRef.documentElement || null;
}

function createPulseCoordinates(index) {
  const normalizedIndex = Math.max(0, Number(index) || 0);

  return {
    clientX: normalizedIndex % (MAX_COORDINATE_OFFSET + 1),
    clientY: (normalizedIndex * 2) % (MAX_COORDINATE_OFFSET + 1),
  };
}

function dispatchMouseMovement(target, coordinates, MouseEventCtor = globalThis.MouseEvent) {
  if (!target?.dispatchEvent || typeof MouseEventCtor !== "function") {
    return false;
  }

  const event = new MouseEventCtor("mousemove", {
    bubbles: true,
    cancelable: true,
    clientX: coordinates.clientX,
    clientY: coordinates.clientY,
    movementX: 1,
    movementY: 1,
    view: globalThis.window || null,
  });

  target.dispatchEvent(event);
  return true;
}

function dispatchActivityPulse({ documentRef, MouseEventCtor } = {}) {
  const target = getPulseTarget(documentRef);

  if (!target) {
    return false;
  }

  pulseCount += 1;

  return dispatchMouseMovement(
    target,
    createPulseCoordinates(pulseCount),
    MouseEventCtor,
  );
}

function handleRuntimeMessage(message, dependencies) {
  if (message?.type !== ACTIVITY_PULSE) {
    return false;
  }

  return dispatchActivityPulse(dependencies);
}

if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    handleRuntimeMessage(message);
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    ACTIVITY_PULSE,
    createPulseCoordinates,
    dispatchActivityPulse,
    dispatchMouseMovement,
    getPulseTarget,
    handleRuntimeMessage,
  };
}
