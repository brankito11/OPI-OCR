<script lang="ts">
	import FileUpload from './FileUpload.svelte';
	import ResultDisplay from './ResultDisplay.svelte';
	import { apiService } from '$lib/services/api.service';
	import type { ProcessingState, PlaceholderMapping } from '$lib/types/types';

	let jsonFiles = $state<File[]>([]);
	let promptTemplate = $state<string>('');
	let mappings = $state<PlaceholderMapping[]>([{ placeholder: '', filename: '' }]);
	let processingState = $state<ProcessingState>('idle');
	let result = $state<any>(null);
	let error = $state<string>('');

	const exampleTemplate = `Analiza los siguientes datos:

Estrategia: _JSON_FORM1_
Resultados: _JSON_FORM2_

Genera un reporte comparativo detallado.`;

	function handleFilesSelected(selectedFiles: File[]) {
		jsonFiles = selectedFiles;
		// Auto-populate mappings based on files
		if (jsonFiles.length > mappings.length) {
			const newMappings = jsonFiles.map((file: File, index: number) => ({
				placeholder: `_JSON_FORM${index + 1}_`,
				filename: file.name
			}));
			mappings = newMappings;
		}
		result = null;
		error = '';
	}

	function handleError(errorMsg: string) {
		error = errorMsg;
	}

	function addMapping() {
		mappings = [...mappings, { placeholder: '', filename: '' }];
	}

	function removeMapping(index: number) {
		mappings = mappings.filter((_: PlaceholderMapping, i: number) => i !== index);
	}

	function useExampleTemplate() {
		promptTemplate = exampleTemplate;
	}

	async function generateReport() {
		if (!promptTemplate.trim() || jsonFiles.length === 0) {
			error = 'Por favor completa la plantilla y selecciona archivos JSON';
			return;
		}

		// Validate mappings
		const validMappings = mappings.filter((m: PlaceholderMapping) => m.placeholder && m.filename);
		if (validMappings.length === 0) {
			error = 'Por favor define al menos un mapeo de placeholder';
			return;
		}

		processingState = 'processing';
		error = '';
		result = null;

		// Create mapping object
		const mappingObj: Record<string, string> = {};
		validMappings.forEach((m: PlaceholderMapping) => {
			mappingObj[m.placeholder] = m.filename;
		});

		const response = await apiService.generateReport({
			prompt_template: promptTemplate,
			file_placeholder_map: JSON.stringify(mappingObj),
			files: jsonFiles
		});

		if (response.success) {
			processingState = 'success';
			result = response.data;
		} else {
			processingState = 'error';
			error = response.error || 'Error al generar el reporte';
		}
	}
</script>

<div class="generator-container">
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
			<h2 class="title">Generador de Reportes Dinámicos</h2>
			<p class="description">
				Combina múltiples archivos JSON con plantillas de prompts para generar reportes complejos
			</p>
		</div>
	</div>

	<div class="content">
		<div class="template-section">
			<div class="section-header">
				<label class="section-label" for="template">Plantilla de Prompt</label>
				<button type="button" class="example-link" onclick={useExampleTemplate}>
					Usar ejemplo
				</button>
			</div>
			<textarea
				id="template"
				bind:value={promptTemplate}
				placeholder="Escribe tu plantilla con placeholders como _JSON_FORM1_, _JSON_FORM2_, etc."
				rows="6"
				class="template-textarea"
			></textarea>
			<p class="hint">
				Usa placeholders como <code>_JSON_FORM1_</code>, <code>_JSON_FORM2_</code> para referenciar tus
				archivos JSON
			</p>
		</div>

		<div class="files-section">
			<label class="section-label">Archivos JSON</label>
			<FileUpload
				accept=".json"
				multiple={true}
				label="Selecciona múltiples archivos JSON"
				maxSize={5}
				onfilesselected={handleFilesSelected}
				onerror={handleError}
			/>
		</div>

		{#if jsonFiles.length > 0}
			<div class="mappings-section">
				<div class="section-header">
					<label class="section-label">Mapeo de Placeholders</label>
					<button type="button" class="add-mapping-btn" onclick={addMapping}>
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Agregar
					</button>
				</div>

				<div class="mappings-list">
					{#each mappings as mapping, index}
						<div class="mapping-item">
							<input
								type="text"
								bind:value={mapping.placeholder}
								placeholder="_JSON_FORM1_"
								class="mapping-input"
							/>
							<span class="arrow">→</span>
							<select bind:value={mapping.filename} class="mapping-select">
								<option value="">Selecciona archivo</option>
								{#each jsonFiles as file}
									<option value={file.name}>{file.name}</option>
								{/each}
							</select>
							{#if mappings.length > 1}
								<button
									type="button"
									class="remove-mapping-btn"
									onclick={() => removeMapping(index)}
								>
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

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
			class="generate-btn"
			disabled={!promptTemplate.trim() ||
				jsonFiles.length === 0 ||
				processingState === 'processing'}
			onclick={generateReport}
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
				<span>Generando reporte...</span>
			{:else}
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				<span>Generar Reporte</span>
			{/if}
		</button>

		{#if result}
			<div class="result-wrapper">
				<ResultDisplay
					data={result}
					title="Reporte Generado"
					downloadFilename="generated-report.json"
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.generator-container {
		background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
		border: 1px solid rgba(236, 72, 153, 0.3);
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
		background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
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

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.section-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.example-link {
		font-size: 0.75rem;
		color: #ec4899;
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.example-link:hover {
		color: #f472b6;
	}

	.template-textarea {
		width: 100%;
		padding: 1rem;
		background: rgba(30, 41, 59, 0.5);
		border: 1px solid rgba(236, 72, 153, 0.3);
		border-radius: 0.75rem;
		color: #e2e8f0;
		font-size: 0.875rem;
		font-family: 'Fira Code', 'Courier New', monospace;
		resize: vertical;
		transition: all 0.2s ease;
	}

	.template-textarea:focus {
		outline: none;
		border-color: rgba(236, 72, 153, 0.6);
		background: rgba(30, 41, 59, 0.7);
	}

	.template-textarea::placeholder {
		color: #64748b;
	}

	.hint {
		font-size: 0.75rem;
		color: #94a3b8;
		margin: 0.5rem 0 0 0;
	}

	.hint code {
		background: rgba(236, 72, 153, 0.2);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		color: #ec4899;
		font-family: 'Fira Code', 'Courier New', monospace;
	}

	.mappings-section {
		display: flex;
		flex-direction: column;
	}

	.add-mapping-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		background: rgba(236, 72, 153, 0.2);
		border: 1px solid rgba(236, 72, 153, 0.4);
		border-radius: 0.375rem;
		color: #ec4899;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add-mapping-btn:hover {
		background: rgba(236, 72, 153, 0.3);
		border-color: rgba(236, 72, 153, 0.6);
	}

	.add-mapping-btn svg {
		width: 1rem;
		height: 1rem;
	}

	.mappings-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.mapping-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.mapping-input,
	.mapping-select {
		flex: 1;
		padding: 0.75rem;
		background: rgba(30, 41, 59, 0.5);
		border: 1px solid rgba(236, 72, 153, 0.3);
		border-radius: 0.5rem;
		color: #e2e8f0;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	.mapping-input:focus,
	.mapping-select:focus {
		outline: none;
		border-color: rgba(236, 72, 153, 0.6);
		background: rgba(30, 41, 59, 0.7);
	}

	.arrow {
		color: #94a3b8;
		font-weight: 600;
	}

	.remove-mapping-btn {
		padding: 0.5rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.remove-mapping-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.5);
	}

	.remove-mapping-btn svg {
		width: 1rem;
		height: 1rem;
		color: #ef4444;
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

	.generate-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
		border: none;
		border-radius: 0.75rem;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
	}

	.generate-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 25px rgba(236, 72, 153, 0.4);
	}

	.generate-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.generate-btn svg {
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
