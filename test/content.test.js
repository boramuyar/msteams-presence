const assert = require("node:assert/strict");
const test = require("node:test");

const {
  ACTIVITY_PULSE,
  createPulseCoordinates,
  handleRuntimeMessage,
} = require("../src/content.js");

class FakeMouseEvent {
  constructor(type, options) {
    this.type = type;
    Object.assign(this, options);
  }
}

function createDocumentWithTarget(target) {
  return {
    body: target,
    documentElement: null,
  };
}

test("unknown messages do not dispatch events", () => {
  const events = [];
  const target = { dispatchEvent: (event) => events.push(event) };

  const handled = handleRuntimeMessage(
    { type: "unknown" },
    {
      documentRef: createDocumentWithTarget(target),
      MouseEventCtor: FakeMouseEvent,
    },
  );

  assert.equal(handled, false);
  assert.deepEqual(events, []);
});

test("activity-pulse dispatches mouse movement events", () => {
  const events = [];
  const target = { dispatchEvent: (event) => events.push(event) };

  const handled = handleRuntimeMessage(
    { type: ACTIVITY_PULSE },
    {
      documentRef: createDocumentWithTarget(target),
      MouseEventCtor: FakeMouseEvent,
    },
  );

  assert.equal(handled, true);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "mousemove");
  assert.equal(events[0].bubbles, true);
  assert.equal(events[0].cancelable, true);
});

test("generated coordinates change between pulses but stay small and non-negative", () => {
  const first = createPulseCoordinates(1);
  const second = createPulseCoordinates(2);

  assert.notDeepEqual(first, second);
  for (const coordinates of [first, second]) {
    assert.equal(coordinates.clientX >= 0, true);
    assert.equal(coordinates.clientY >= 0, true);
    assert.equal(coordinates.clientX <= 8, true);
    assert.equal(coordinates.clientY <= 8, true);
  }
});

test("activity-pulse does not throw when no usable target exists", () => {
  assert.doesNotThrow(() => {
    const handled = handleRuntimeMessage(
      { type: ACTIVITY_PULSE },
      {
        documentRef: { body: null, documentElement: null },
        MouseEventCtor: FakeMouseEvent,
      },
    );

    assert.equal(handled, false);
  });
});
