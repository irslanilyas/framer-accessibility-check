// src/lib/framer/nodeUtils.ts

/**
 * Checks if a node is a FrameNode
 * @param node The node to check
 * @returns True if the node is a FrameNode
 */
export function isFrameNode(node: any): boolean {
  try {
    return node && node.type === 'FRAME';
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a node is a TextNode
 * @param node The node to check
 * @returns True if the node is a TextNode
 */
export function isTextNode(node: any): boolean {
  try {
    return node && node.type === 'TEXT';
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a node is an ImageNode
 * @param node The node to check
 * @returns True if the node is an ImageNode
 */
export function isImageNode(node: any): boolean {
  try {
    return node && node.type === 'IMAGE';
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a node is a GroupNode (component or instance)
 * @param node The node to check
 * @returns True if the node is a GroupNode
 */
export function isGroupNode(node: any): boolean {
  try {
    return node && (node.type === 'COMPONENT' || node.type === 'INSTANCE');
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a node is a ComponentNode
 * @param node The node to check
 * @returns True if the node is a ComponentNode
 */
export function isComponentNode(node: any): boolean {
  try {
    return node && node.type === 'COMPONENT';
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a node is an InstanceNode
 * @param node The node to check
 * @returns True if the node is an InstanceNode
 */
export function isInstanceNode(node: any): boolean {
  try {
    return node && node.type === 'INSTANCE';
  } catch (error) {
    return false;
  }
}

/**
 * Gets the bounding box of a node (alternative to getRect)
 * @param node The node to get bounds for
 * @returns Promise with bounding box information
 */
export async function getNodeBounds(node: any): Promise<{ x: number; y: number; width: number; height: number } | null> {
  try {
    if (node && typeof node.getBoundingBox === 'function') {
      return await node.getBoundingBox();
    }
    // Fallback to direct properties if available
    if (node && typeof node.x === 'number' && typeof node.y === 'number') {
      return {
        x: node.x,
        y: node.y,
        width: node.width || 0,
        height: node.height || 0
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting node bounds:', error);
    return null;
  }
}