import type {
    OcrRequest,
    PromptExtractorRequest,
    ReportGeneratorRequest,
    ApiResponse
} from '$lib/types/types';

const API_BASE_URL = 'https://proceso-de-archivos-ia.onrender.com';

class ApiService {
    /**
     * Extract text from PDF using Mistral OCR
     */
    async extractTextFromPDF(request: OcrRequest): Promise<ApiResponse> {
        try {
            const formData = new FormData();
            formData.append('archivo', request.archivo);

            const response = await fetch(`${API_BASE_URL}/mistral-ocr/`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error extracting text from PDF');
            }

            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Analyze PDF with AI using custom prompt and JSON base
     */
    async analyzeWithAI(request: PromptExtractorRequest): Promise<ApiResponse> {
        try {
            const formData = new FormData();
            formData.append('pdf_file', request.pdf_file);
            formData.append('json_file', request.json_file);
            formData.append('prompt', request.prompt);

            const response = await fetch(`${API_BASE_URL}/probar-prompt-extractor/`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error analyzing with AI');
            }

            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Generate report using prompt template and multiple JSON files
     */
    async generateReport(request: ReportGeneratorRequest): Promise<ApiResponse> {
        try {
            const formData = new FormData();
            formData.append('prompt_template', request.prompt_template);
            formData.append('file_placeholder_map', request.file_placeholder_map);

            // Append all files
            request.files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch(`${API_BASE_URL}/probar-prompt-generador/`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error generating report');
            }

            const data = await response.json();
            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Download JSON data as a file
     */
    downloadJSON(data: any, filename: string = 'result.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export const apiService = new ApiService();
