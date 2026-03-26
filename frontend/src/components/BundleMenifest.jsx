import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Download, Search } from 'lucide-react';

const BundleManifest = ({ bundleItems, categoryFields, auction }) => {
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    if (!bundleItems || bundleItems.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Items in Bundle</h3>
                <p className="mt-2 text-sm text-gray-500">This bundle doesn't have any items listed.</p>
            </div>
        );
    }

    // Filter items based on search
    const filteredItems = bundleItems.filter(item => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();

        // Search in specifications
        const specsMatch = Object.values(item.specifications || {}).some(val =>
            String(val).toLowerCase().includes(searchLower)
        );

        // Search in notes
        const notesMatch = item.notes?.toLowerCase().includes(searchLower);

        return specsMatch || notesMatch;
    });

    // Sort by item number
    const sortedItems = [...filteredItems].sort((a, b) => a.itemNumber - b.itemNumber);

    // Show first 5 or all
    const displayedItems = showAll ? sortedItems : sortedItems.slice(0, 5);

    const totalItems = bundleItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const uniqueItems = bundleItems.length;

    const handleExportCSV = () => {
        // Create CSV headers
        const headers = ['Item #', 'Quantity', ...categoryFields.map(f => f.label), 'Notes'];

        // Create CSV rows
        const rows = bundleItems.map(item => [
            item.itemNumber,
            item.quantity || 1,
            ...categoryFields.map(field => item.specifications?.[field.name] || '-'),
            item.notes || ''
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bundle-manifest-${auction?._id?.slice(-6) || 'export'}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">
                            Bundle Manifest
                        </h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {totalItems} total
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {uniqueItems} unique
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                        </div>

                        {/* Export Button */}
                        {/* <button
                            onClick={handleExportCSV}
                            className="p-1.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                            title="Export as CSV"
                        >
                            <Download className="h-4 w-4" />
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                            </th>
                            {categoryFields.sort((a, b) => a.order - b.order).map(field => (
                                <th key={field.name} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {field.label}
                                </th>
                            ))}
                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Notes
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {displayedItems.length > 0 ? (
                            displayedItems.map((item) => (
                                <tr key={item._id || item.id || item.itemNumber} 
                                className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {item.itemNumber}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            {item.quantity || 1}
                                        </span>
                                    </td>
                                    {categoryFields.sort((a, b) => a.order - b.order).map(field => (
                                        <td key={field.name} className="px-4 py-3">
                                            <div className="flex items-center gap-1 capitalize">
                                                {field.name === 'color' && item.specifications?.[field.name] && (
                                                    <span
                                                        className="w-3 h-3 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: item.specifications[field.name].toLowerCase() }}
                                                    />
                                                )}
                                                <span className={item.specifications?.[field.name] ? 'text-gray-900' : 'text-gray-400'}>
                                                    {item.specifications?.[field.name] || '-'}
                                                    {field.unit && item.specifications?.[field.name] && ` ${field.unit}`}
                                                </span>
                                            </div>
                                        </td>
                                    ))}
                                    {/* <td className="px-4 py-3">
                                        {item.notes ? (
                                            <span className="text-gray-600 text-sm line-clamp-1" title={item.notes}>
                                                {item.notes}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3 + categoryFields.length} className="px-4 py-8 text-center text-gray-500">
                                    No items match your search
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Show More / Less */}
            {sortedItems.length > 5 && (
                <div className="border-t border-gray-200 px-4 py-3">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                        {showAll ? (
                            <>Show Less <ChevronUp className="h-4 w-4" /></>
                        ) : (
                            <>Show All {sortedItems.length} Items <ChevronDown className="h-4 w-4" /></>
                        )}
                    </button>
                </div>
            )}

            {/* Footer stats */}
            {!searchTerm && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-600">
                    <div className="flex flex-wrap gap-4">
                        <span>📦 Total Quantity: {totalItems}</span>
                        <span>🔢 Unique Items: {uniqueItems}</span>
                        {categoryFields.slice(0, 3).map(field => {
                            const uniqueValues = new Set(
                                bundleItems.map(item => item.specifications?.[field.name]).filter(Boolean)
                            );
                            return uniqueValues.size > 0 && (
                                <span key={field.name}>
                                    🏷️ {field.label}: {uniqueValues.size} unique
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BundleManifest;