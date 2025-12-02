<script lang="ts">
	interface Props {
		data: any;
		title?: string;
		downloadFilename?: string;
	}

	let { data, title = 'Resultado', downloadFilename = 'result.json' }: Props = $props();

	let copied = $state(false);

	function copyToClipboard() {
		const text = JSON.stringify(data, null, 2);
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function downloadJSON() {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = downloadFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<div class="result-container">
	<div class="result-header">
		<h3 class="result-title">{title}</h3>
		<div class="result-actions">
			<button type="button" class="action-btn" onclick={copyToClipboard}>
				{#if copied}
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Copiado!</span>
				{:else}
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					<span>Copiar</span>
				{/if}
			</button>
			<button type="button" class="action-btn download" onclick={downloadJSON}>
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				<span>Descargar</span>
			</button>
		</div>
	</div>

	<div class="result-content">
		<pre class="json-display"><code>{JSON.stringify(data, null, 2)}</code></pre>
	</div>
</div>

<style>
	.result-container {
		background: rgba(30, 41, 59, 0.5);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 1rem;
		overflow: hidden;
		backdrop-filter: blur(10px);
	}

	.result-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background: rgba(139, 92, 246, 0.1);
		border-bottom: 1px solid rgba(139, 92, 246, 0.2);
	}

	.result-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0;
	}

	.result-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(139, 92, 246, 0.2);
		border: 1px solid rgba(139, 92, 246, 0.4);
		border-radius: 0.5rem;
		color: #e2e8f0;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn:hover {
		background: rgba(139, 92, 246, 0.3);
		border-color: rgba(139, 92, 246, 0.6);
		transform: translateY(-1px);
	}

	.action-btn.download {
		background: rgba(16, 185, 129, 0.2);
		border-color: rgba(16, 185, 129, 0.4);
	}

	.action-btn.download:hover {
		background: rgba(16, 185, 129, 0.3);
		border-color: rgba(16, 185, 129, 0.6);
	}

	.action-btn svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.result-content {
		padding: 1.5rem;
		max-height: 400px;
		overflow-y: auto;
	}

	.json-display {
		margin: 0;
		font-family: 'Fira Code', 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		color: #e2e8f0;
		background: transparent;
	}

	.json-display code {
		color: #10b981;
	}

	/* Custom scrollbar */
	.result-content::-webkit-scrollbar {
		width: 8px;
	}

	.result-content::-webkit-scrollbar-track {
		background: rgba(15, 23, 42, 0.5);
		border-radius: 4px;
	}

	.result-content::-webkit-scrollbar-thumb {
		background: rgba(139, 92, 246, 0.5);
		border-radius: 4px;
	}

	.result-content::-webkit-scrollbar-thumb:hover {
		background: rgba(139, 92, 246, 0.7);
	}
</style>
