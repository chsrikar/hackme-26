import React from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

export default function ExportButton({ data, filename = 'report.csv', label = 'Export CSV' }) {
  const handleExport = () => {
    if (!data || !data.length) return;

    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Header row
    csvRows.push(headers.join(','));

    // Data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    // Create blob and link
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>
      {label}
    </Button>
  );
}
