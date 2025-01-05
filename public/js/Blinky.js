import Ghost from './Ghost.js';

// AI: Run after the closest Pac-Man, taking into account intersections
export default class Blinky extends Ghost {
    getDirection() {
        // If the ghost is at an intersection or not yet moving
        if (this.isIntersection() || this.direction === 0) {
            const deltaX = Math.abs(this.i - this.target.x); // Horizontal distance to the target
            const deltaY = Math.abs(this.j - this.target.y); // Vertical distance to the target
            let xDirections = []; // Preferred horizontal directions
            let yDirections = []; // Preferred vertical directions
            let prioritizedDirections = []; // Final ordered directions

            // Determine preferred horizontal directions
            if (this.i > this.target.x) {
                xDirections = [this.left, this.right]; // Prefer left if to the right of target
            } else {
                xDirections = [this.right, this.left]; // Prefer right if to the left of target
            }

            // Determine preferred vertical directions
            if (this.j > this.target.y) {
                yDirections = [this.up, this.down]; // Prefer up if below the target
            } else {
                yDirections = [this.down, this.up]; // Prefer down if above the target
            }

            // Prioritize directions based on distance
            if (deltaX > deltaY) {
                // Prefer horizontal movement first
                prioritizedDirections = [xDirections[0], yDirections[0], yDirections[1], xDirections[1]];
            } else {
                // Prefer vertical movement first
                prioritizedDirections = [yDirections[0], xDirections[0], xDirections[1], yDirections[1]];
            }

            // Check each prioritized direction for availability
            for (const dir of prioritizedDirections) {
                if (!this.isBlocked(dir)) {
                    return dir; // Return the first non-blocked direction
                }
            }

            // No available direction, keep current direction
            return this.direction;
        }

        // If not at an intersection, continue current direction
        return this.direction;
    }
}
