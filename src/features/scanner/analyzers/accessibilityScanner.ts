// src/features/scanner/analyzers/accessibilityScanner.ts

import { Issue } from "../../../types/issueTypes";
import { analyzeContrast } from "./contrastAnalyzer";
import { analyzeTextSize } from "./textSizeAnalyzer";
import { analyzeTouchTargets } from "./touchTargetAnalyzer";
import { analyzeImageAccessibility } from "./imageAccessibilityAnalyzer";
import { analyzeColorBlindness } from "./colorBlindnessAnalyzer";
import { analyzeNavigation } from "./navigationAnalyzer";

// Simple UUID generation function
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Type for analyzer functions
type AnalyzerFunction = (nodes: any[]) => Promise<Issue[]>;

interface AnalyzerConfig {
  name: string;
  analyzer: AnalyzerFunction;
  enabled: boolean;
}

/**
 * Runs a complete accessibility check on all nodes in the Framer project
 * @param nodes Array of nodes from the Framer project
 * @param options Optional settings for the accessibility check
 * @returns Array of accessibility issues found
 */
export async function runAccessibilityCheck(
  nodes: any[], 
  options?: { 
    includeColorBlindness?: boolean;
    onProgress?: (completed: number, total: number) => void;
  }
): Promise<Issue[]> {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  try {
    // Default options
    const checkOptions = {
      includeColorBlindness: options?.includeColorBlindness ?? true,
      onProgress: options?.onProgress
    };

    // Configure analyzers
    const analyzers: AnalyzerConfig[] = [
      { name: 'contrast', analyzer: analyzeContrast, enabled: true },
      { name: 'textSize', analyzer: analyzeTextSize, enabled: true },
      { name: 'touchTargets', analyzer: analyzeTouchTargets, enabled: true },
      { name: 'imageAccessibility', analyzer: analyzeImageAccessibility, enabled: true },
      { name: 'colorBlindness', analyzer: analyzeColorBlindness, enabled: checkOptions.includeColorBlindness },
      { name: 'navigation', analyzer: analyzeNavigation, enabled: true }
    ];

    const enabledAnalyzers = analyzers.filter(a => a.enabled);
    console.log(`Running ${enabledAnalyzers.length} analyzers on ${nodes.length} nodes`);

    // For very large projects, split nodes into batches
    const maxBatchSize = 500;
    const batchSize = Math.min(maxBatchSize, Math.max(50, Math.floor(nodes.length / 10)));
    const batches = [];
    
    for (let i = 0; i < nodes.length; i += batchSize) {
      batches.push(nodes.slice(i, i + batchSize));
    }
    
    console.log(`Processing ${nodes.length} nodes in ${batches.length} batches of ~${batchSize} nodes each`);

    const allIssues: Issue[] = [];
    let completedTasks = 0;
    const totalTasks = batches.length * enabledAnalyzers.length;

    // Process each batch
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} nodes)`);

      // Run analyzers in parallel for current batch
      const batchPromises = enabledAnalyzers.map(async ({ name, analyzer }) => {
        try {
          console.log(`Running ${name} analyzer on batch ${batchIndex + 1}`);
          const issues = await analyzer(batch);
          completedTasks++;
          
          // Report progress
          if (checkOptions.onProgress) {
            checkOptions.onProgress(completedTasks, totalTasks);
          }
          
          return issues;
        } catch (error) {
          console.error(`Error in ${name} analyzer:`, error);
          completedTasks++;
          
          // Report progress even on error
          if (checkOptions.onProgress) {
            checkOptions.onProgress(completedTasks, totalTasks);
          }
          
          return [];
        }
      });

      // Wait for all analyzers to complete for this batch
      const batchResults = await Promise.all(batchPromises);
      
      // Flatten and add to all issues
      batchResults.forEach(issues => {
        allIssues.push(...issues);
      });

      // Add a small delay between batches to prevent overwhelming the system
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    console.log(`All analyzers completed. Found ${allIssues.length} total issues`);

    // Sort issues by severity (critical first, then warning, then info)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Final progress update
    if (checkOptions.onProgress) {
      checkOptions.onProgress(totalTasks, totalTasks);
    }

    return allIssues;
  } catch (error) {
    console.error("Error running accessibility check:", error);
    return [];
  }
}

/**
 * Utility function to run analyzers sequentially (useful for debugging)
 * @param nodes Array of nodes from the Framer project
 * @param options Optional settings for the accessibility check
 * @returns Array of accessibility issues found
 */
export async function runAccessibilityCheckSequential(
  nodes: any[], 
  options?: { 
    includeColorBlindness?: boolean;
    onProgress?: (completed: number, total: number) => void;
  }
): Promise<Issue[]> {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  try {
    const checkOptions = {
      includeColorBlindness: options?.includeColorBlindness ?? true,
      onProgress: options?.onProgress
    };

    const analyzers: AnalyzerConfig[] = [
      { name: 'contrast', analyzer: analyzeContrast, enabled: true },
      { name: 'textSize', analyzer: analyzeTextSize, enabled: true },
      { name: 'touchTargets', analyzer: analyzeTouchTargets, enabled: true },
      { name: 'imageAccessibility', analyzer: analyzeImageAccessibility, enabled: true },
      { name: 'colorBlindness', analyzer: analyzeColorBlindness, enabled: checkOptions.includeColorBlindness },
      { name: 'navigation', analyzer: analyzeNavigation, enabled: true }
    ];

    const enabledAnalyzers = analyzers.filter(a => a.enabled);
    const allIssues: Issue[] = [];

    // Run analyzers sequentially
    for (let i = 0; i < enabledAnalyzers.length; i++) {
      const { name, analyzer } = enabledAnalyzers[i];
      
      try {
        console.log(`Running ${name} analyzer (${i + 1}/${enabledAnalyzers.length})`);
        const issues = await analyzer(nodes);
        allIssues.push(...issues);
        
        if (checkOptions.onProgress) {
          checkOptions.onProgress(i + 1, enabledAnalyzers.length);
        }
      } catch (error) {
        console.error(`Error in ${name} analyzer:`, error);
      }
    }

    // Sort issues by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return allIssues;
  } catch (error) {
    console.error("Error running accessibility check:", error);
    return [];
  }
}