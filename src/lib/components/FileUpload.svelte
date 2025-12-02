<script lang="ts">
	interface Props {
		accept?: string;
		multiple?: boolean;
		label?: string;
		maxSize?: number; // in MB
		onfilesselected?: (files: File[]) => void;
		onerror?: (error: string) => void;
	}

	let {
		accept = '.pdf,.json',
		multiple = false,
		label = 'Arrastra archivos aquí o haz clic para seleccionar',
		maxSize = 10,
		onfilesselected,
		onerror
	}: Props = $props();

	let isDragging = $state(false);
	let files = $state<File[]>([]);

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const droppedFiles = Array.from(event.dataTransfer?.files || []);
		processFiles(droppedFiles);
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const selectedFiles = Array.from(target.files || []);
		processFiles(selectedFiles);
	}

	function processFiles(newFiles: File[]) {
		// Validate file size
		const oversizedFiles = newFiles.filter((file) => file.size > maxSize * 1024 * 1024);
		if (oversizedFiles.length > 0) {
			onerror?.(`Algunos archivos exceden el tamaño máximo de ${maxSize}MB`);
			return;
		}

		// Validate file type
		const acceptedTypes = accept.split(',').map((type) => type.trim());
		const invalidFiles = newFiles.filter((file) => {
			const extension = '.' + file.name.split('.').pop()?.toLowerCase();
			return !acceptedTypes.includes(extension);
		});

		if (invalidFiles.length > 0) {
			onerror?.(`Tipo de archivo no válido. Acepta: ${accept}`);
			return;
		}

		if (multiple) {
			files = [...files, ...newFiles];
		} else {
			files = newFiles.slice(0, 1);
		}

		onfilesselected?.(files);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
		onfilesselected?.(files);
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}
</script>

<div class="file-upload-container">
	<div
		class="drop-zone"
		class:dragging={isDragging}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		role="button"
		tabindex="0"
	>
		<input
			type="file"
			{accept}
			{multiple}
			onchange={handleFileSelect}
			class="file-input"
			id="file-input"
		/>
		<label for="file-input" class="drop-zone-label">
			<svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/>
			</svg>
			<span class="label-text">{label}</span>
			<span class="label-hint">Tamaño máximo: {maxSize}MB</span>
		</label>
	</div>

	{#if files.length > 0}
		<div class="files-list">
			{#each files as file, index}
				<div class="file-item">
					<div class="file-info">
						<svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<div class="file-details">
							<span class="file-name">{file.name}</span>
							<span class="file-size">{formatFileSize(file.size)}</span>
						</div>
					</div>
					<button type="button" class="remove-btn" onclick={() => removeFile(index)}>
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.file-upload-container {
		width: 100%;
	}

	.drop-zone {
		border: 2px dashed rgba(139, 92, 246, 0.3);
		border-radius: 1rem;
		padding: 2rem;
		text-align: center;
		transition: all 0.3s ease;
		background: rgba(139, 92, 246, 0.05);
		cursor: pointer;
	}

	.drop-zone:hover,
	.drop-zone.dragging {
		border-color: rgba(139, 92, 246, 0.6);
		background: rgba(139, 92, 246, 0.1);
		transform: scale(1.01);
	}

	.file-input {
		display: none;
	}

	.drop-zone-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	.upload-icon {
		width: 3rem;
		height: 3rem;
		color: #8b5cf6;
	}

	.label-text {
		font-size: 1rem;
		font-weight: 500;
		color: #e2e8f0;
	}

	.label-hint {
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.files-list {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.file-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: rgba(30, 41, 59, 0.5);
		border-radius: 0.5rem;
		border: 1px solid rgba(139, 92, 246, 0.2);
		transition: all 0.2s ease;
	}

	.file-item:hover {
		background: rgba(30, 41, 59, 0.7);
		border-color: rgba(139, 92, 246, 0.4);
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.file-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: #8b5cf6;
	}

	.file-details {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.file-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: #e2e8f0;
	}

	.file-size {
		font-size: 0.75rem;
		color: #94a3b8;
	}

	.remove-btn {
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

	.remove-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.5);
	}

	.remove-btn svg {
		width: 1rem;
		height: 1rem;
		color: #ef4444;
	}
</style>
