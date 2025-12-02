// API Request Types
export interface OcrRequest {
    archivo: File;
}

export interface PromptExtractorRequest {
    pdf_file: File;
    json_file: File;
    prompt: string;
}

export interface ReportGeneratorRequest {
    prompt_template: string;
    file_placeholder_map: string; // JSON string mapping placeholders to filenames
    files: File[];
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface OcrResponse {
    text: string;
    pages?: number;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface HTTPValidationError {
    detail: ValidationError[];
}

// UI State Types
export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface FileUploadState {
    file: File | null;
    preview?: string;
    error?: string;
}

export interface PlaceholderMapping {
    placeholder: string;
    filename: string;
}
