<script lang="ts">
	import OcrExtractor from '$lib/components/OcrExtractor.svelte';
	import PromptExtractor from '$lib/components/PromptExtractor.svelte';
	import ReportGenerator from '$lib/components/ReportGenerator.svelte';

	type Tab = 'ocr' | 'extractor' | 'generator';

	let activeTab = $state<Tab>('ocr');

	const tabs = [
		{
			id: 'ocr' as Tab,
			name: 'OCR Extractor',
			description: 'Extrae texto de PDFs',
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		},
		{
			id: 'extractor' as Tab,
			name: 'IA Extractor',
			description: 'Análisis inteligente',
			icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
		},
		{
			id: 'generator' as Tab,
			name: 'Generador',
			description: 'Reportes dinámicos',
			icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		}
	];
</script>

<svelte:head>
	<title>OCR & IA Processing - Procesamiento Inteligente de Documentos</title>
	<meta
		name="description"
		content="Plataforma de procesamiento de documentos con OCR, extracción inteligente de datos y generación de reportes dinámicos"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="app-container">
	<!-- Hero Section -->
	<header class="hero">
		<div class="hero-content">
			<div class="logo">
				<svg class="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			</div>
			<h1 class="hero-title">
				Procesamiento Inteligente de <span class="gradient-text">Documentos</span>
			</h1>
			<p class="hero-description">
				Extrae, analiza y genera reportes con tecnología de IA de última generación
			</p>
		</div>
	</header>

	<!-- Tab Navigation -->
	<nav class="tabs-nav">
		{#each tabs as tab}
			<button
				type="button"
				class="tab-button"
				class:active={activeTab === tab.id}
				onclick={() => (activeTab = tab.id)}
			>
				<svg class="tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon} />
				</svg>
				<div class="tab-content">
					<span class="tab-name">{tab.name}</span>
					<span class="tab-description">{tab.description}</span>
				</div>
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<main class="main-content">
		{#if activeTab === 'ocr'}
			<div class="tab-panel">
				<OcrExtractor />
			</div>
		{:else if activeTab === 'extractor'}
			<div class="tab-panel">
				<PromptExtractor />
			</div>
		{:else if activeTab === 'generator'}
			<div class="tab-panel">
				<ReportGenerator />
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="footer">
		<p>Powered by Mistral AI & OpenAI</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
		min-height: 100vh;
		color: #e2e8f0;
	}

	.app-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		animation: fadeIn 0.6s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Hero Section */
	.hero {
		text-align: center;
		margin-bottom: 3rem;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.logo {
		width: 5rem;
		height: 5rem;
		background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
		border-radius: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 12px 40px rgba(139, 92, 246, 0.6);
		}
	}

	.logo-icon {
		width: 2.5rem;
		height: 2.5rem;
		color: white;
	}

	.hero-title {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		margin: 0;
		line-height: 1.2;
	}

	.gradient-text {
		background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #10b981 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: 1.125rem;
		color: #94a3b8;
		margin: 0;
		max-width: 600px;
	}

	/* Tab Navigation */
	.tabs-nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.tab-button {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: rgba(30, 41, 59, 0.5);
		border: 2px solid rgba(139, 92, 246, 0.2);
		border-radius: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}

	.tab-button:hover {
		background: rgba(30, 41, 59, 0.7);
		border-color: rgba(139, 92, 246, 0.4);
		transform: translateY(-2px);
	}

	.tab-button.active {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
		border-color: rgba(139, 92, 246, 0.6);
		box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
	}

	.tab-icon {
		width: 2rem;
		height: 2rem;
		color: #8b5cf6;
		flex-shrink: 0;
	}

	.tab-button.active .tab-icon {
		color: #a78bfa;
	}

	.tab-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}

	.tab-name {
		font-size: 1rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.tab-description {
		font-size: 0.75rem;
		color: #94a3b8;
	}

	/* Main Content */
	.main-content {
		margin-bottom: 3rem;
	}

	.tab-panel {
		animation: slideIn 0.4s ease;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Footer */
	.footer {
		text-align: center;
		padding: 2rem 0;
		color: #64748b;
		font-size: 0.875rem;
		border-top: 1px solid rgba(139, 92, 246, 0.2);
	}

	.footer p {
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.app-container {
			padding: 1rem;
		}

		.tabs-nav {
			grid-template-columns: 1fr;
		}

		.hero-title {
			font-size: 2rem;
		}

		.hero-description {
			font-size: 1rem;
		}
	}
</style>
