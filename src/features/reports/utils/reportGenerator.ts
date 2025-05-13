import { Issue } from '../../../types/issueTypes';
import { groupBy, countBy } from '../../../lib/utils/array';

/**
 * Generates an accessibility report from the scan results
 * @param issues The array of issues found in the scan
 * @returns A promise that resolves when the report is generated
 */
export async function generateReport(issues: Issue[]): Promise<void> {
  // Group issues by type and severity
  const issuesByType = groupBy(issues, 'type');
  const issuesBySeverity = groupBy(issues, 'severity');
  
  // Count issues by type and severity
  const countByType = countBy(issues, 'type');
  const countBySeverity = countBy(issues, 'severity');
  
  // Create report content
  const reportContent = `
# Accessibility Report

Generated on: ${new Date().toLocaleString()}

## Summary

Total issues found: ${issues.length}

### Issues by Severity

${Object.entries(countBySeverity)
  .map(([severity, count]) => `- ${severity}: ${count}`)
  .join('\n')}

### Issues by Type

${Object.entries(countByType)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join('\n')}

## Detailed Findings

${Object.entries(issuesByType).map(([type, typeIssues]) => `
### ${type} Issues

${typeIssues.map(issue => `
#### ${issue.title}

- **Severity**: ${issue.severity}
- **Element**: ${issue.location.nodeName}
- **Description**: ${issue.description}
${issue.wcagGuideline ? `- **WCAG Guideline**: ${issue.wcagGuideline}` : ''}
${issue.currentValue ? `- **Current Value**: ${issue.currentValue}` : ''}
${issue.requiredValue ? `- **Required Value**: ${issue.requiredValue}` : ''}

**Suggested Fixes**:
${issue.fixSuggestions.map(fix => `- ${fix.description}`).join('\n')}
`).join('\n')}
`).join('\n')}
`;

  // In a real implementation, we would create a downloadable file
  // For now, we'll simulate it by creating a blob and downloading it
  const blob = new Blob([reportContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `accessibility-report-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}