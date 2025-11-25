// Inverse Kinematics Solver for Dobot Magician
// Simplified IK solver for robot arm manipulation

class IKSolver {
    constructor(joints) {
        this.joints = joints;
        this.iterations = 10;
        this.tolerance = 0.01;
    }

    // Solve IK using CCD (Cyclic Coordinate Descent) algorithm
    solve(targetPosition) {
        if (!this.joints || this.joints.length === 0) return;

        for (let iteration = 0; iteration < this.iterations; iteration++) {
            // Work backwards from end effector
            for (let i = this.joints.length - 2; i >= 0; i--) {
                const joint = this.joints[i];
                const endEffector = this.joints[this.joints.length - 1];

                // Get positions in world space
                const jointPos = new THREE.Vector3();
                const endPos = new THREE.Vector3();
                
                joint.getWorldPosition(jointPos);
                endEffector.getWorldPosition(endPos);

                // Calculate vectors
                const toEnd = new THREE.Vector3().subVectors(endPos, jointPos);
                const toTarget = new THREE.Vector3().subVectors(targetPosition, jointPos);

                // Calculate rotation angle
                const angle = toEnd.angleTo(toTarget);

                if (angle < this.tolerance) continue;

                // Calculate rotation axis
                const axis = new THREE.Vector3().crossVectors(toEnd, toTarget).normalize();

                // Apply rotation
                const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
                joint.quaternion.multiplyQuaternions(quaternion, joint.quaternion);
            }

            // Check if we've reached target
            const endEffector = this.joints[this.joints.length - 1];
            const endPos = new THREE.Vector3();
            endEffector.getWorldPosition(endPos);

            const distance = endPos.distanceTo(targetPosition);
            if (distance < this.tolerance) {
                break;
            }
        }
    }

    // Forward kinematics - calculate end effector position from joint angles
    forwardKinematics() {
        if (!this.joints || this.joints.length === 0) return null;

        const endEffector = this.joints[this.joints.length - 1];
        const position = new THREE.Vector3();
        endEffector.getWorldPosition(position);

        return position;
    }

    // Get joint angles
    getJointAngles() {
        return this.joints.map(joint => {
            return {
                x: joint.rotation.x,
                y: joint.rotation.y,
                z: joint.rotation.z
            };
        });
    }

    // Set joint angles
    setJointAngles(angles) {
        angles.forEach((angle, index) => {
            if (index < this.joints.length) {
                this.joints[index].rotation.set(angle.x, angle.y, angle.z);
            }
        });
    }

    // Clamp joint angles to physical limits
    clampJointAngles() {
        // Define joint limits for Dobot Magician (in radians)
        const limits = [
            { min: -Math.PI, max: Math.PI },      // Base rotation
            { min: -Math.PI/4, max: Math.PI/2 },  // Shoulder
            { min: -Math.PI/2, max: Math.PI/2 },  // Elbow
            { min: -Math.PI/2, max: Math.PI/2 },  // Wrist
            { min: -Math.PI/4, max: Math.PI/4 }   // End effector
        ];

        this.joints.forEach((joint, index) => {
            if (index < limits.length) {
                joint.rotation.x = THREE.MathUtils.clamp(
                    joint.rotation.x,
                    limits[index].min,
                    limits[index].max
                );
                joint.rotation.y = THREE.MathUtils.clamp(
                    joint.rotation.y,
                    limits[index].min,
                    limits[index].max
                );
                joint.rotation.z = THREE.MathUtils.clamp(
                    joint.rotation.z,
                    limits[index].min,
                    limits[index].max
                );
            }
        });
    }
}

// Helper function to solve IK (called from main script)
function solveIK(joints, targetPosition) {
    const solver = new IKSolver(joints);
    solver.solve(targetPosition);
    solver.clampJointAngles();
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IKSolver, solveIK };
}