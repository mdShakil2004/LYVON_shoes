import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ImportExportModal = ({ isOpen, onClose, mode, onImport, onExport, isLoading }) => {
  const [file, setFile] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    includeAllFields: true,
    includeImages: false,
    format: 'csv',
  });
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null); // Reference to file input

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv' && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
      setImportResult(null);
      setProgress(0);
      setErrorMessage(null);
    } else {
      setErrorMessage('Please upload a valid CSV file (max 10MB).');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv' && droppedFile.size <= 10 * 1024 * 1024) {
      setFile(droppedFile);
      setImportResult(null);
      setProgress(0);
      setErrorMessage(null);
    } else {
      setErrorMessage('Please drop a valid CSV file (max 10MB).');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    const result = await onImport(file, (progressValue) => setProgress(progressValue));
    setImportResult(result);
  };

  const handleExport = () => {
    onExport(exportOptions);
    onClose();
  };

  // Function to programmatically trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'import' ? 'Import Products' : 'Export Products'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Icon name="X" size={24} />
          </Button>
        </div>
        <div className="p-6 space-y-6">
          {mode === 'import' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Upload CSV File
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-500 dark:border-gray-700'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  aria-label="Drag and drop CSV file or click to upload"
                >
                  {file ? (
                    <div className="space-y-2">
                      <Icon name="File" size={32} className="mx-auto text-blue-500 dark:text-blue-400" />
                      <p className="text-sm text-gray-900">{file.name}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setErrorMessage(null);
                        }}
                        className="border-gray-700 dark:border-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Icon name="Upload" size={32} className="mx-auto text-gray-800 dark:text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Drop CSV file here or click to upload
                        </p>
                        <p className="text-xs text-gray-500">CSV files only, max 10MB</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        className="border-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        Choose File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                        aria-label="Upload CSV file"
                      />
                    </div>
                  )}
                </div>
                {errorMessage && (
                  <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
                )}
              </div>
              {progress > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Import Progress</p>
                  <div
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              {importResult && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Import Results</p>
                  <p className="text-sm text-green-500">Imported: {importResult.imported} products</p>
                  <p className="text-sm text-yellow-500">Updated: {importResult.updated} products</p>
                  <p className="text-sm text-red-500">Errors: {importResult.errors}</p>
                  {importResult.errors > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {importResult.errorDetails.map((error, index) => (
                        <p key={index}>Row {error.row}: {error.message}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p>Expected CSV format:</p>
                <p className="font-mono break-words">
                  name,brand,category,price,originalPrice,stock,sizes,sizeStock,description,images,colors,tags,status,featured
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Checkbox
                label="Include All Fields"
                checked={exportOptions.includeAllFields}
                onChange={(e) => setExportOptions({ ...exportOptions, includeAllFields: e.target.checked })}
                description="Export all product fields including descriptions and tags"
              />
              <Checkbox
                label="Include Images"
                checked={exportOptions.includeImages}
                onChange={(e) => setExportOptions({ ...exportOptions, includeImages: e.target.checked })}
                description="Include image URLs in the export"
              />
              <div>
                <label className="block text-sm font-medium text-gray-900">Export Format</label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white  text-gray-900"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 ">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={mode === 'import' ? handleImport : handleExport}
            loading={isLoading}
            disabled={mode === 'import' && !file}
            iconName={mode === 'import' ? 'Upload' : 'Download'}
            iconPosition="left"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {mode === 'import' ? 'Import' : 'Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;