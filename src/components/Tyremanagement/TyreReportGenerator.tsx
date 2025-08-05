import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/FormElements';
import { FileText, Download } from 'lucide-react';

interface TyreReportGeneratorProps {
  onGenerateReport: (type: string, dateRange: string, brand: string) => void;
}

interface ReportOptions {
  reportType: string;
  dateRange: string;
  format: string;
  includeScrapped: boolean;
}

const reportTypes = [
  { value: 'inventory', label: 'Inventory Report' },
  { value: 'wear', label: 'Wear Analysis Report' },
  { value: 'cost', label: 'Cost Analysis Report' },
  { value: 'maintenance', label: 'Maintenance History Report' },
  { value: 'performance', label: 'Performance Comparison Report' },
];

const dateRanges = [
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
  { value: 'last180', label: 'Last 180 Days' },
  { value: 'lastYear', label: 'Last Year' },
  { value: 'allTime', label: 'All Time' },
];

const reportFormats = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'excel', label: 'Excel Spreadsheet' },
  { value: 'csv', label: 'CSV File' },
];

export const TyreReportGenerator: React.FC<TyreReportGeneratorProps> = ({ onGenerateReport }) => {
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    reportType: 'inventory',
    dateRange: 'last30',
    format: 'pdf',
    includeScrapped: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptionChange = (option: keyof ReportOptions, value: string | boolean) => {
    setReportOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Call the provided callback function
    onGenerateReport(
      reportOptions.reportType, 
      reportOptions.dateRange, 
      'All Brands' // In a real implementation, this would be a selected brand
    );

    // Simulate report generation with timeout
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Generate Tyre Reports</CardTitle>
          <FileText className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <Select
            id="reportType"
            value={reportOptions.reportType}
            onChange={(e) => handleOptionChange('reportType', e.target.value)}
            className="w-full"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <Select
            id="dateRange"
            value={reportOptions.dateRange}
            onChange={(e) => handleOptionChange('dateRange', e.target.value)}
            className="w-full"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <Select
            id="format"
            value={reportOptions.format}
            onChange={(e) => handleOptionChange('format', e.target.value)}
            className="w-full"
          >
            {reportFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </Select>
        </div>
        
        <div className="flex items-center">
          <input
            id="includeScrapped"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={reportOptions.includeScrapped}
            onChange={(e) => handleOptionChange('includeScrapped', e.target.checked)}
          />
          <label htmlFor="includeScrapped" className="ml-2 text-sm text-gray-700">
            Include scrapped tyres
          </label>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            onClick={() => alert('Preview not available in this version')}
            icon={<FileText className="w-4 h-4" />}
            disabled={isGenerating}
          >
            Preview
          </Button>
          <Button
            onClick={handleGenerateReport}
            icon={<Download className="w-4 h-4" />}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
