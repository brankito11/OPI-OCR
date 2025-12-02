<script lang="ts">
	import FileUpload from './FileUpload.svelte';
	import ResultDisplay from './ResultDisplay.svelte';
	import { apiService } from '$lib/services/api.service';
	import type { ProcessingState } from '$lib/types/types';

	let pdfFile = $state<File | null>(null);
	let jsonFile = $state<File | null>(null);
	let prompt = $state<string>('');
	let processingState = $state<ProcessingState>('idle');
	let result = $state<any>(null);
	let error = $state<string>('');

	const examplePrompts = [
		'Extrae todos los nombres, fechas y montos del documento',
		'Identifica las secciones principales y resume cada una',
		'Busca información de contacto y direcciones'
	];

	function handlePdfSelected(files: File[]) {
		pdfFile = files[0] || null;
		result = null;
		error = '';
	}

	function handleJsonSelected(files: File[]) {
		jsonFile = files[0] || null;
		result = null;
		error = '';
	}

	function handleError(errorMsg: string) {
		error = errorMsg;
	}

	function setExamplePrompt(example: string) {
		prompt = example;
	}

	async function analyzeDocument() {
		if (!pdfFile || !jsonFile || !prompt.trim()) {
			error = 'Por favor completa todos los campos';
			return;
		}

		processingState = 'processing';
		error = '';
		result = null;

		const response = await apiService.analyzeWithAI({
			pdf_file: pdfFile,
			json_file: jsonFile,
			prompt: prompt
		});

		if (response.success) {
			processingState = 'success';
			result = response.data;
		} else {
			processingState = 'error';
			error = response.error || 'Error al analizar el documento';
		}
	}
</script>

<div class="extractor-container">
	<div class="header">
		<div class="icon-wrapper">
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
				/>
			</svg>
		</div>
		<div>
			<h2 class="title">Extracción Inteligente con IA</h2>
			<p class="description">
				Combina PDF y JSON con instrucciones personalizadas para extraer datos estructurados
			</p>
		</div>
	</div>

	<div class="content">
		<div class="files-grid">
			<div class="file-section">
				<label class="section-label">Archivo PDF</label>
				<FileUpload
					accept=".pdf"
					label="Selecciona el PDF a analizar"
					maxSize={20}
					onfilesselected={handlePdfSelected}
					onerror={handleError}
				/>
			</div>

			<div class="file-section">
				<label class="section-label">Archivo JSON Base</label>
				<FileUpload
					accept=".json"
					label="Selecciona el JSON base"
					maxSize={5}
					onfilesselected={handleJsonSelected}
					onerror={handleError}
				/>
			</div>
		</div>

		<div class="prompt-section">
			<label class="section-label" for="prompt">Instrucciones para la IA</label>
			<textarea
				id="prompt"
				bind:value={prompt}
				placeholder="Describe qué información deseas extraer del PDF..."
				rows="4"
				class="prompt-textarea"
			></textarea>

			<div class="examples">
				<span class="examples-label">Ejemplos:</span>
				<div class="examples-grid">
					{#each examplePrompts as example}
						<button type="button" class="example-btn" onclick={() => setExamplePrompt(example)}>
							{example}
						</button>
					{/each}
				</div>
			</div>
		</div>

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
			class="analyze-btn"
			disabled={!pdfFile || !jsonFile || !prompt.trim() || processingState === 'processing'}
			onclick={analyzeDocument}
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
				<span>Analizando con IA...</span>
			{:else}
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
				<span>Analizar con IA</span>
			{/if}
		</button>

		{#if result}
			<div class="result-wrapper">
				<ResultDisplay
					data={result}
					title="Datos Extraídos"
					downloadFilename="extracted-data.json"
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.extractor-container {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
		border: 1px solid rgba(16, 185, 129, 0.3);
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
		background: linear-gradient(135deg, #10b981 0%, #8b5cf6 100%);
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

	.files-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.file-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.section-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.prompt-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.prompt-textarea {
		width: 100%;
		padding: 1rem;
		background: rgba(30, 41, 59, 0.5);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: 0.75rem;
		color: #e2e8f0;
		font-size: 0.875rem;
		font-family: inherit;
		resize: vertical;
		transition: all 0.2s ease;
	}

	.prompt-textarea:focus {
		outline: none;
		border-color: rgba(16, 185, 129, 0.6);
		background: rgba(30, 41, 59, 0.7);
	}

	.prompt-textarea::placeholder {
		color: #64748b;
	}

	.examples {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.examples-label {
		font-size: 0.75rem;
		color: #94a3b8;
		font-weight: 500;
	}

	.examples-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.example-btn {
		padding: 0.5rem 1rem;
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: 0.5rem;
		color: #10b981;
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.example-btn:hover {
		background: rgba(16, 185, 129, 0.2);
		border-color: rgba(16, 185, 129, 0.5);
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

	.analyze-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #10b981 0%, #8b5cf6 100%);
		border: none;
		border-radius: 0.75rem;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
	}

	.analyze-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
	}

	.analyze-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.analyze-btn svg {
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
