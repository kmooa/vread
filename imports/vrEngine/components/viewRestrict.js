let registerComponent = AFRAME.registerComponent;
let THREE = window.THREE;
let DEFAULT_CAMERA_HEIGHT = AFRAME.DEFAULT_CAMERA_HEIGHT;
let bind = AFRAME.utils.bind;

// To avoid recalculation at every mouse movement tick
let GRABBING_CLASS = 'a-grabbing';
let PI_2 = Math.PI / 2;
let radToDeg = THREE.Math.radToDeg;

/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */
module.exports.Component = registerComponent('restricted-look-controls', {
    dependencies: ['position', 'rotation'],

    schema: {
        maxPitch: {default: ""},
        maxYaw: {default: ""},
        enabled: {default: true},
        touchEnabled: {default: true},
        hmdEnabled: {default: true},
        reverseMouseDrag: {default: false},
        standing: {default: true}
    },

    init: function () {
        let sceneEl = this.el.sceneEl;

        this.previousHMDPosition = new THREE.Vector3();
        this.hmdQuaternion = new THREE.Quaternion();
        this.hmdEuler = new THREE.Euler();
        this.position = new THREE.Vector3();
        this.rotation = {};
        this.deltaRotation = {};
        this.data.maxPitch = parseInt(this.data.maxPitch);
        this.data.maxYaw = parseInt(this.data.maxYaw);

        this.setupMouseControls();
        this.setupHMDControls();
        this.bindMethods();

        // Reset previous HMD position when we exit VR.
        sceneEl.addEventListener('exit-vr', this.onExitVR);
    },

    update: function (oldData) {
        let data = this.data;

        // Disable grab cursor classes if no longer enabled.
        if (data.enabled !== oldData.enabled) {
            this.updateGrabCursor(data.enabled);
        }

        // Reset pitch and yaw if disabling HMD.
        if (oldData && !data.hmdEnabled && !oldData.hmdEnabled) {
            this.pitchObject.rotation.set(0, 0, 0);
            this.yawObject.rotation.set(0, 0, 0);
        }
    },

    tick: function (t) {
        let data = this.data;
        if (!data.enabled) { return; }
        this.controls.standing = data.standing;
        this.controls.userHeight = this.getUserHeight();
        this.controls.update();
        this.updateOrientation();
        this.updatePosition();
    },

    /**
     * Return user height to use for standing poses, where a device doesn't provide an offset.
     */
    getUserHeight: function () {
        let el = this.el;
        return el.hasAttribute('camera')
            ? el.getAttribute('camera').userHeight
            : DEFAULT_CAMERA_HEIGHT;
    },

    play: function () {
        this.addEventListeners();
    },

    pause: function () {
        this.removeEventListeners();
    },

    remove: function () {
        this.removeEventListeners();
    },

    bindMethods: function () {
        this.onMouseDown = bind(this.onMouseDown, this);
        this.onMouseMove = bind(this.onMouseMove, this);
        this.onMouseUp = bind(this.onMouseUp, this);
        this.onTouchStart = bind(this.onTouchStart, this);
        this.onTouchMove = bind(this.onTouchMove, this);
        this.onTouchEnd = bind(this.onTouchEnd, this);
        this.onExitVR = bind(this.onExitVR, this);
    },

    /**
     * Set up states and Object3Ds needed to store rotation data.
     */
    setupMouseControls: function () {
        this.mouseDown = false;
        this.pitchObject = new THREE.Object3D();
        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = 10;
        this.yawObject.add(this.pitchObject);
    },

    /**
     * Set up VR controls that will copy data to the dolly.
     */
    setupHMDControls: function () {
        this.dolly = new THREE.Object3D();
        this.euler = new THREE.Euler();
        this.controls = new THREE.VRControls(this.dolly);
        this.controls.userHeight = 0.0;
    },

    /**
     * Add mouse and touch event listeners to canvas.
     */
    addEventListeners: function () {
        let sceneEl = this.el.sceneEl;
        let canvasEl = sceneEl.canvas;

        // Wait for canvas to load.
        if (!canvasEl) {
            sceneEl.addEventListener('render-target-loaded', bind(this.addEventListeners, this));
            return;
        }

        // Mouse events.
        canvasEl.addEventListener('mousedown', this.onMouseDown, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('mouseup', this.onMouseUp, false);

        // Touch events.
        canvasEl.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchEnd);
    },

    /**
     * Remove mouse and touch event listeners from canvas.
     */
    removeEventListeners: function () {
        let sceneEl = this.el.sceneEl;
        let canvasEl = sceneEl && sceneEl.canvas;

        if (!canvasEl) { return; }

        // Mouse events.
        canvasEl.removeEventListener('mousedown', this.onMouseDown);
        canvasEl.removeEventListener('mousemove', this.onMouseMove);
        canvasEl.removeEventListener('mouseup', this.onMouseUp);
        canvasEl.removeEventListener('mouseout', this.onMouseUp);

        // Touch events.
        canvasEl.removeEventListener('touchstart', this.onTouchStart);
        canvasEl.removeEventListener('touchmove', this.onTouchMove);
        canvasEl.removeEventListener('touchend', this.onTouchEnd);
    },

    /**
     * Update orientation for mobile, mouse drag, and headset.
     * Mouse-drag only enabled if HMD is not active.
     */
    updateOrientation: function () {
        let currentRotation;
        let deltaRotation = this.deltaRotation;
        let hmdEuler = this.hmdEuler;
        let hmdQuaternion = this.hmdQuaternion;
        let pitchObject = this.pitchObject;
        let yawObject = this.yawObject;
        let sceneEl = this.el.sceneEl;
        let rotation = this.rotation;

        // Calculate HMD quaternion.
        hmdQuaternion = hmdQuaternion.copy(this.dolly.quaternion);
        hmdEuler.setFromQuaternion(hmdQuaternion, 'YXZ');

        if (sceneEl.isMobile) {
            // On mobile, do camera rotation with touch events and sensors.
            rotation.x = radToDeg(hmdEuler.x) + radToDeg(pitchObject.rotation.x);
            rotation.y = radToDeg(hmdEuler.y) + radToDeg(yawObject.rotation.y);
            rotation.z = radToDeg(hmdEuler.z);

            let maxPitch = parseInt(this.data.maxPitch),
                maxYaw = parseInt(this.data.maxYaw);

            if(this.data.maxPitch !== "" && Math.abs(rotation.x) > maxPitch) {
                rotation.x = radToDeg(hmdEuler.x) > 0 ? maxPitch : -1 * maxPitch;
            }

            if(this.data.maxYaw !== "" && (Math.abs(rotation.y)) > maxYaw) {
                rotation.y = radToDeg(hmdEuler.y) > 0 ? maxYaw : -1 * maxYaw;
            }

        } else if (!sceneEl.is('vr-mode') || isNullVector(hmdEuler) || !this.data.hmdEnabled) {
            // Mouse drag if WebVR not active (not connected, no incoming sensor data).
            currentRotation = this.el.getAttribute('rotation');
            this.calculateDeltaRotation();
            if (this.data.reverseMouseDrag) {
                rotation.x = currentRotation.x - deltaRotation.x;
                rotation.y = currentRotation.y - deltaRotation.y;
                rotation.z = currentRotation.z;
            } else {
                rotation.x = currentRotation.x + deltaRotation.x;
                rotation.y = currentRotation.y + deltaRotation.y;
                rotation.z = currentRotation.z;
            }

            let maxPitch = parseInt(this.data.maxPitch),
                maxYaw = parseInt(this.data.maxYaw);

            if(this.data.maxPitch !== "" && Math.abs(rotation.x) > maxPitch) {
                rotation.x = currentRotation.x > 0 ? maxPitch : -1 * maxPitch;
            }

            if(this.data.maxYaw !== "" && (Math.abs(rotation.y)) > maxYaw) {
                rotation.y = currentRotation.y > 0 ? maxYaw : -1 * maxYaw;
            }
        } else {
            // Mouse rotation ignored with an active headset. Use headset rotation.
            rotation.x = radToDeg(hmdEuler.x);
            rotation.y = radToDeg(hmdEuler.y);
            rotation.z = radToDeg(hmdEuler.z);

            let maxPitch = parseInt(this.data.maxPitch),
                maxYaw = parseInt(this.data.maxYaw);

            if(this.data.maxPitch !== "" && Math.abs(rotation.x) > maxPitch) {
                rotation.x = radToDeg(hmdEuler.x) > 0 ? maxPitch : -1 * maxPitch;
            }

            if(this.data.maxYaw !== "" && (Math.abs(rotation.y)) > maxYaw) {
                rotation.y = radToDeg(hmdEuler.y) > 0 ? maxYaw : -1 * maxYaw;
            }
        }

        this.el.setAttribute('rotation', rotation);
    },

    /**
     * Validate angle of camera compared to given maxYaw and maxPitch
     */
    checkRange(pitch, yaw){
        let maxPitch = parseInt(this.data.maxPitch),
            maxYaw = parseInt(this.data.maxYaw);

        if(this.data.maxPitch != "" && Math.abs(rotation.x) > maxPitch) {
            console.log("OVER PITCH!", rotation.x, maxPitch);
            rotation.x = currentRotation.x > 0 ? maxPitch : -1 * maxPitch;
        }

        if(this.data.maxYaw != "" && (Math.abs(rotation.y)) > maxYaw) {
            console.log("OVER YAW!", rotation.y, maxYaw);
            if(isNaN(rotation.y)){
                console.log("Problem...")
            }
            console.log(rotation.y = currentRotation.y)
            rotation.y = currentRotation.y > 0 ? maxYaw : -1 * maxYaw;
        }
    },

    /**
     * Calculate delta rotation for mouse-drag and touch-drag.
     */
    calculateDeltaRotation: function () {
        let currentRotationX = radToDeg(this.pitchObject.rotation.x);
        let currentRotationY = radToDeg(this.yawObject.rotation.y);
        this.deltaRotation.x = currentRotationX - (this.previousRotationX || 0);
        this.deltaRotation.y = currentRotationY - (this.previousRotationY || 0);
        // Store current rotation for next tick.
        this.previousRotationX = currentRotationX;
        this.previousRotationY = currentRotationY;
        return this.deltaRotation;
    },

    /**
     * Handle positional tracking.
     */
    updatePosition: function () {
        let el = this.el;
        let currentHMDPosition;
        let currentPosition;
        let position = this.position;
        let previousHMDPosition = this.previousHMDPosition;
        let sceneEl = this.el.sceneEl;

        if (!sceneEl.is('vr-mode')) { return; }

        // Calculate change in position.
        currentHMDPosition = this.calculateHMDPosition();

        currentPosition = el.getAttribute('position');

        position.copy(currentPosition).sub(previousHMDPosition).add(currentHMDPosition);
        el.setAttribute('position', position);
        previousHMDPosition.copy(currentHMDPosition);
    },

    /**
     * Get headset position from VRControls.
     */
    calculateHMDPosition: (function () {
        let position = new THREE.Vector3();
        return function () {
            this.dolly.updateMatrix();
            position.setFromMatrixPosition(this.dolly.matrix);
            return position;
        };
    })(),

    /**
     * Translate mouse drag into rotation.
     *
     * Dragging up and down rotates the camera around the X-axis (yaw).
     * Dragging left and right rotates the camera around the Y-axis (pitch).
     */
    onMouseMove: function (event) {
        let pitchObject = this.pitchObject;
        let yawObject = this.yawObject;
        let previousMouseEvent = this.previousMouseEvent;
        let movementX;
        let movementY;

        // Not dragging or not enabled.
        if (!this.mouseDown || !this.data.enabled) { return; }

        // Calculate delta.
        movementX = event.movementX || event.mozMovementX;
        movementY = event.movementY || event.mozMovementY;
        if (movementX === undefined || movementY === undefined) {
            movementX = event.screenX - previousMouseEvent.screenX;
            movementY = event.screenY - previousMouseEvent.screenY;
        }
        this.previousMouseEvent = event;

        // Calculate rotation.
        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;
        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    },

    /**
     * Register mouse down to detect mouse drag.
     */
    onMouseDown: function (evt) {
        if (!this.data.enabled) { return; }
        // Handle only primary button.
        if (evt.button !== 0) { return; }
        this.mouseDown = true;
        this.previousMouseEvent = evt;
        document.body.classList.add(GRABBING_CLASS);
    },

    /**
     * Register mouse up to detect release of mouse drag.
     */
    onMouseUp: function () {
        this.mouseDown = false;
        document.body.classList.remove(GRABBING_CLASS);
    },

    /**
     * Register touch down to detect touch drag.
     */
    onTouchStart: function (evt) {
        if (evt.touches.length !== 1 || !this.data.touchEnabled) { return; }
        this.touchStart = {
            x: evt.touches[0].pageX,
            y: evt.touches[0].pageY
        };
        this.touchStarted = true;
    },

    /**
     * Translate touch move to Y-axis rotation.
     */
    onTouchMove: function (evt) {
        let canvas = this.el.sceneEl.canvas;
        let deltaY;
        let yawObject = this.yawObject;

        if (!this.touchStarted || !this.data.touchEnabled) { return; }

        deltaY = 2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x) / canvas.clientWidth;

        // Limit touch orientaion to to yaw (y axis).
        yawObject.rotation.y -= deltaY * 0.5;
        this.touchStart = {
            x: evt.touches[0].pageX,
            y: evt.touches[0].pageY
        };
    },

    /**
     * Register touch end to detect release of touch drag.
     */
    onTouchEnd: function () {
        this.touchStarted = false;
    },

    onExitVR: function () {
        this.previousHMDPosition.set(0, 0, 0);
    },

    /**
     * Toggle the feature of showing/hiding the grab cursor.
     */
    updateGrabCursor: function (enabled) {
        let sceneEl = this.el.sceneEl;

        function enableGrabCursor () { sceneEl.canvas.classList.add('a-grab-cursor'); }
        function disableGrabCursor () { sceneEl.canvas.classList.remove('a-grab-cursor'); }

        if (!sceneEl.canvas) {
            if (enabled) {
                sceneEl.addEventListener('render-target-loaded', enableGrabCursor);
            } else {
                sceneEl.addEventListener('render-target-loaded', disableGrabCursor);
            }
            return;
        }

        if (enabled) {
            enableGrabCursor();
            return;
        }
        disableGrabCursor();
    }
});

function isNullVector (vector) {
    return vector.x === 0 && vector.y === 0 && vector.z === 0;
}