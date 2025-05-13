// src/features/scanner/store/scannerStore.ts
import { framer } from 'framer-plugin';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Issue, IssueSeverity, IssueType } from '../../../types/issueTypes';
import { runAccessibilityCheck } from '../analyzers/accessibilityScanner';
import { isFrameNode } from 'framer-plugin';

interface ScanStats {
  pagesScanned: number;
  totalPages: number;
  nodesScanned: number;
  issuesFound: number;
  scanStartTime: number | null;
  scanEndTime: number | null;
}

interface ScannerState {
  // Scan state
  isScanning: boolean;
  progress: number;
  
  // Results
  issues: Issue[];
  filteredIssues: Issue[];
  activeIssueId: string | null;
  stats: ScanStats;
  
  // Filters
  severityFilter: IssueSeverity | 'all';
  expandedSections: Record<IssueType, boolean>;
  expandedIssues: Record<string, boolean>;
  
  // Internal scanning state
  scanCancelled: boolean;
  
  // Actions
  startScan: () => Promise<void>;
  cancelScan: () => void;
  setSeverityFilter: (severity: IssueSeverity | 'all') => void;
  toggleSection: (type: IssueType) => void;
  toggleIssueDetails: (issueId: string) => void;
  setActiveIssue: (issueId: string | null) => void;
  locateIssue: (issueId: string) => Promise<void>;
  reset: () => void;
}

// The initial empty state
const initialState = {
  isScanning: false,
  progress: 0,
  issues: [],
  filteredIssues: [],
  activeIssueId: null,
  stats: {
    pagesScanned: 0,
    totalPages: 0,
    nodesScanned: 0,
    issuesFound: 0,
    scanStartTime: null,
    scanEndTime: null,
  },
  severityFilter: 'all' as const,
  expandedSections: {
    contrast: false,
    touchTarget: false,
    textSize: false,
    altText: false,
    colorBlindness: false,
    navigation: false,
  },
  expandedIssues: {},
  scanCancelled: false,
};

// Get all nodes from the current Framer document
async function getAllFramerNodes() {
  try {
    console.log('Starting to fetch nodes from Framer...');
    
    let frameNodes: any[] = [];
    let textNodes: any[] = [];
    
    // Get ALL frame nodes in the project (not just selected)
    try {
      frameNodes = await framer.getNodesWithType("FrameNode");
      console.log('Got frame nodes:', frameNodes.length);
    } catch (e) {
      console.error("Error getting frame nodes:", e);
    }
    
    // Get ALL text nodes in the project (not just selected)
    try {
      textNodes = await framer.getNodesWithType("TextNode");
      console.log('Got text nodes:', textNodes.length);
    } catch (e) {
      console.error("Error getting text nodes:", e);
    }
    
    // Combine all nodes
    const allNodes = [...frameNodes, ...textNodes];
    console.log(`Found total ${allNodes.length} nodes (${frameNodes.length} frames, ${textNodes.length} text)`);
    
    return allNodes;
  } catch (error) {
    console.error('Error getting Framer nodes:', error);
    throw new Error(`Failed to fetch nodes from Framer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get top-level frames (pages) from the canvas
async function getTopLevelFrames() {
  try {
    const canvasRoot = await framer.getCanvasRoot();
    if (canvasRoot) {
      const rootChildren = await canvasRoot.getChildren();
      const pages = rootChildren.filter(node => isFrameNode(node));
      console.log(`Found ${pages.length} top-level frames (pages)`);
      return pages;
    }
    return [];
  } catch (error) {
    console.error('Error getting top-level frames:', error);
    return [];
  }
}

// Progress update utility with exponential smoothing for better UX
const createProgressUpdater = (
  get: () => ScannerState,
  set: (state: Partial<ScannerState>) => void
) => {
  let lastUpdate = 0;
  
  const updateProgress = (currentStep: number, totalSteps: number) => {
    if (get().scanCancelled || !get().isScanning) {
      return;
    }
    
    const now = Date.now();
    
    // Only update every 100ms to prevent too frequent updates
    if (now - lastUpdate < 100) {
      return;
    }
    
    lastUpdate = now;
    const actualProgress = totalSteps > 0 ? (currentStep / totalSteps) : 0;
    
    // Apply exponential smoothing for smoother progress bar
    const currentProgress = get().progress;
    const newProgress = Math.min(0.95, currentProgress + (actualProgress - currentProgress) * 0.3);
    
    set({ progress: newProgress });
  };
  
  return updateProgress;
};

export const useScannerStore = create<ScannerState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      startScan: async () => {
        try {
          console.log('Starting accessibility scan...');
          
          // Reset state
          set({ 
            isScanning: true, 
            progress: 0,
            issues: [],
            filteredIssues: [],
            scanCancelled: false,
            stats: {
              ...initialState.stats,
              scanStartTime: Date.now(),
            }
          });
          
          // Create progress updater
          const updateProgress = createProgressUpdater(get, set);
          
          // Get top-level frames (pages) first
          console.log('Fetching pages from Framer...');
          updateProgress(0, 100);
          
          const pages = await getTopLevelFrames();
          const totalPages = Math.max(1, pages.length); // Ensure at least 1 page
          
          // Update total pages count
          set(state => ({
            stats: {
              ...state.stats,
              totalPages: totalPages,
            }
          }));
          
          // Get all nodes from Framer
          console.log('Fetching all nodes from Framer...');
          const framerNodes = await getAllFramerNodes();
          
          // Check if scan was cancelled
          if (get().scanCancelled) {
            console.log('Scan was cancelled during node fetching');
            return;
          }
          
          if (framerNodes.length === 0) {
            console.warn('No nodes found to scan. Your Framer project appears to be empty.');
            set({ 
              isScanning: false, 
              progress: 0,
              stats: {
                ...get().stats,
                scanEndTime: Date.now(),
              }
            });
            return;
          }
          
          console.log(`Starting analysis of ${framerNodes.length} nodes across ${totalPages} pages`);
          updateProgress(20, 100);
          
          // Run the accessibility check with progress tracking
          console.log('Running accessibility analysis...');
          
          let allIssues: Issue[] = [];
          
          try {
            // If we have pages, scan them one by one
            if (pages.length > 0) {
              for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                
                // Update current page being scanned
                set(state => ({
                  stats: {
                    ...state.stats,
                    pagesScanned: i + 1,
                  }
                }));
                
                // Check if scan was cancelled
                if (get().scanCancelled) {
                  throw new Error('Scan cancelled');
                }
                
                // Get nodes for this page
                let pageFrameNodes: any[] = [];
                let pageTextNodes: any[] = [];
                
                try {
                  pageFrameNodes = await page.getNodesWithType("FrameNode");
                  pageTextNodes = await page.getNodesWithType("TextNode");
                } catch (e) {
                  console.error(`Error getting nodes for page ${i + 1}:`, e);
                }
                
                const pageNodes = [page, ...pageFrameNodes, ...pageTextNodes];
                
                // Update progress
                const progressBase = 20 + (i / totalPages) * 60;
                updateProgress(progressBase, 100);
                
                // Analyze this page
                const pageIssues = await runAccessibilityCheck(
                  pageNodes,
                  {
                    includeColorBlindness: true,
                    onProgress: (nodeStep: number, nodeTotal: number) => {
                      // Check if scan was cancelled
                      if (get().scanCancelled) {
                        throw new Error('Scan cancelled');
                      }
                      
                      // Update nodes scanned
                      const previousNodes = allIssues.reduce((sum, _, idx) => sum + (idx < i ? 1 : 0), 0);
                      const currentNodes = Math.floor((nodeStep / nodeTotal) * pageNodes.length);
                      
                      set(state => ({
                        stats: {
                          ...state.stats,
                          nodesScanned: previousNodes + currentNodes,
                        }
                      }));
                    }
                  }
                );
                
                // Add issues from this page
                allIssues = [...allIssues, ...pageIssues];
                
                // Update issues found in real-time
                set(state => ({
                  stats: {
                    ...state.stats,
                    issuesFound: allIssues.length,
                  }
                }));
              }
            } else {
              // No pages detected, scan all nodes as one page
              set(state => ({
                stats: {
                  ...state.stats,
                  pagesScanned: 1,
                  totalPages: 1,
                }
              }));
              
              allIssues = await runAccessibilityCheck(
                framerNodes, 
                {
                  includeColorBlindness: true,
                  onProgress: (step: number, total: number) => {
                    // Check if scan was cancelled
                    if (get().scanCancelled) {
                      throw new Error('Scan cancelled');
                    }
                    
                    // Update progress: 20% for node fetching, 60% for analysis, 20% for finalization
                    const analysisProgress = 20 + (step / total) * 60;
                    updateProgress(analysisProgress, 100);
                    
                    // Update stats in real-time
                    set(state => ({
                      stats: {
                        ...state.stats,
                        nodesScanned: step,
                        issuesFound: allIssues.length,
                      }
                    }));
                  }
                }
              );
            }
            
            // Check if scan was cancelled
            if (get().scanCancelled) {
              console.log('Scan was cancelled during analysis');
              return;
            }
            
            updateProgress(90, 100);
            console.log('Analysis complete. Found', allIssues.length, 'accessibility issues');
            
            // Calculate final stats
            const stats = {
              pagesScanned: totalPages,
              totalPages: totalPages,
              nodesScanned: framerNodes.length,
              issuesFound: allIssues.length,
              scanStartTime: get().stats.scanStartTime,
              scanEndTime: Date.now(),
            };
            
            // Complete the scan
            set({ 
              isScanning: false, 
              progress: 1,
              issues: allIssues,
              filteredIssues: allIssues,
              stats,
            });
            
            console.log('Scan completed successfully');
          } catch (analysisError) {
            if (get().scanCancelled) {
              console.log('Scan was cancelled');
              set({ 
                isScanning: false, 
                progress: 0,
                stats: {
                  ...get().stats,
                  scanEndTime: Date.now(),
                }
              });
            } else {
              console.error('runAccessibilityCheck threw an error:', analysisError);
              throw analysisError;
            }
          }
          
        } catch (error) {
          console.error('Accessibility scan failed:', error);
          
          // Reset scanning state
          set({ 
            isScanning: false, 
            progress: 0,
            stats: {
              ...get().stats,
              scanEndTime: Date.now(),
            }
          });
        }
      },
      
      cancelScan: () => {
        console.log('Cancelling scan...');
        set({ scanCancelled: true });
        
        // Give time for the scan to recognize cancellation
        setTimeout(() => {
          set({ 
            isScanning: false, 
            progress: 0,
            scanCancelled: false,
          });
        }, 500);
      },
      
      setSeverityFilter: (severity) => {
        const { issues } = get();
        
        const filteredIssues = severity === 'all' 
          ? issues 
          : issues.filter(issue => issue.severity === severity);
        
        set({ severityFilter: severity, filteredIssues });
      },
      
      toggleSection: (type) => {
        const { expandedSections } = get();
        set({ 
          expandedSections: { 
            ...expandedSections, 
            [type]: !expandedSections[type] 
          } 
        });
      },
      
      toggleIssueDetails: (issueId) => {
        const { expandedIssues } = get();
        set({ 
          expandedIssues: { 
            ...expandedIssues, 
            [issueId]: !expandedIssues[issueId] 
          } 
        });
      },
      
      setActiveIssue: (issueId) => {
        set({ activeIssueId: issueId });
      },
      
      locateIssue: async (issueId) => {
        const { issues } = get();
        const issue = issues.find(i => i.id === issueId);
        
        if (!issue) {
          console.error('Issue not found:', issueId);
          return;
        }
        
        console.log(`Attempting to locate issue: ${issueId} on node: ${issue.location.nodeId}`);
        
        try {
          // Try to select and focus on the node
          await framer.setSelection([issue.location.nodeId]);
          
          // Try to zoom into view if the method exists
          if (typeof framer.zoomIntoView === 'function') {
            await framer.zoomIntoView(issue.location.nodeId);
          }
          
          set({ activeIssueId: issueId });
        } catch (error) {
          console.error('Error locating issue:', error);
        }
      },
      
      reset: () => {
        console.log('Resetting scanner state...');
        set(initialState);
      },
    }),
    {
      name: 'accessibility-scanner-state',
      partialize: (state) => ({
        expandedSections: state.expandedSections,
        severityFilter: state.severityFilter,
      }),
    }
  )
)