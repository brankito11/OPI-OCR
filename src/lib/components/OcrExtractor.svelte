<script lang="ts">
	import FileUpload from './FileUpload.svelte';
	import ResultDisplay from './ResultDisplay.svelte';
	import { apiService } from '$lib/services/api.service';
	import type { ProcessingState } from '$lib/types/types';

	let pdfFile = $state<File | null>(null);
	let processingState = $state<ProcessingState>('idle');
	let result = $state<any>(null);
	let error = $state<string>('');

	function handleFilesSelected(files: File[]) {
		pdfFile = files[0] || null;
		result = null;
		error = '';
	}

	function handleError(errorMsg: string) {
		error = errorMsg;
	}

	async function extractText() {
		if (!pdfFile) {
			error = 'Por favor selecciona un archivo PDF';
			return;
		}

		processingState = 'processing';
		error = '';
		result = null;

		const response = await apiService.extractTextFromPDF({ archivo: pdfFile });

		if (response.success) {
			processingState = 'success';
			result = response.data;
		} else {
			processingState = 'error';
			error = response.error || 'Error al procesar el archivo';
		}
	}
</script>

<div class="ocr-container">
	<div class="header">
		<div class="icon-wrapper">
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
		</div>
		<div>
			<h2 class="title">Extracción de Texto con OCR</h2>
			<p class="description">Extrae texto de archivos PDF utilizando tecnología Mistral OCR</p>
		</div>
	</div>

	<div class="content">
		<FileUpload
			accept=".pdf"
			label="Arrastra un archivo PDF aquí"
			maxSize={20}
			onfilesselected={handleFilesSelected}
			onerror={handleError}
		/>

		{#if error}
			<div class="error-message">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<button
			type="button"
			class="extract-btn"
			disabled={!pdfFile || processingState === 'processing'}
			onclick={extractText}
		>
			{#if processingState === 'processing'}
				<svg class="spinner" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<span>Procesando...</span>
			{:else}
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				<span>Extraer Texto</span>
			{/if}
		</button>

		{#if result}
			<div class="result-wrapper">
				<ResultDisplay
					data={result}
					title="Texto Extraído"
					downloadFilename="extracted-text.json"
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.ocr-container {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 1.5rem;
		padding: 2rem;
		backdrop-filter: blur(10px);
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.icon-wrapper {
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.icon {
		width: 2rem;
		height: 2rem;
		color: white;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #e2e8f0;
		margin: 0 0 0.5rem 0;
	}

	.description {
		font-size: 0.875rem;
		color: #94a3b8;
		margin: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 0.75rem;
		color: #fca5a5;
	}

	.error-message svg {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
	}

	.extract-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
		border: none;
		border-radius: 0.75rem;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
	}

	.extract-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 25px rgba(139, 92, 246, 0.4);
	}

	.extract-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.extract-btn svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.result-wrapper {
		animation: fadeIn 0.5s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
