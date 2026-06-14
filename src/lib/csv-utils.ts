// Parses a CSV string into an array of objects with headers.
export function parseCSV(csvString: string): { headers: string[]; data: Record<string, string>[] } {
    const rows = csvString.trim().split(/\r?\n/); // Handles both \n and \r\n
    if (rows.length === 0) return { headers: [], data: [] };

    // More robust header splitting, handles quoted commas
    const headers = rows[0].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(h => h.replace(/^"|"$/g, '').trim()) || [];
    
    const data = rows.slice(1).map(rowStr => {
        // More robust value splitting
        const values = rowStr.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
        const rowData: Record<string, string> = {};
        headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
        });
        return rowData;
    });
    return { headers, data };
}

// Generates a CSV string from an array of data objects.
export function generateCSV(data: Record<string, any>[], headers?: string[]): string {
    if (data.length === 0) return '';
    
    const effectiveHeaders = headers || Object.keys(data[0]);
    
    const escapeCSVValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // If value contains comma, newline, or double quote, wrap in double quotes and escape inner double quotes.
        if (/[",\n\r]/.test(stringValue)) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    const headerRow = effectiveHeaders.map(escapeCSVValue).join(',');
    const dataRows = data.map(row =>
        effectiveHeaders.map(header => escapeCSVValue(row[header])).join(',')
    );
    return [headerRow, ...dataRows].join('\n');
}

// Triggers a browser download for the given CSV string.
export function downloadCSV(csvString: string, filename: string): void {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
