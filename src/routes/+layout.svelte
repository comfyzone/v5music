<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
	<!-- HTML Meta Tags -->
	<title>v5</title>
	<meta name="description" content="New music bot website" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content="https://v5.pixelboop.net" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="v5" />
	<meta property="og:description" content="New music bot website" />
	<meta
		property="og:image"
		content="/banner.png"
	/>

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="v5.pixelboop.net" />
	<meta property="twitter:url" content="https://v5.pixelboop.net" />
	<meta name="twitter:title" content="v5" />
	<meta name="twitter:description" content="New music bot website" />
	<meta
		name="twitter:image"
		content="/banner.png"
	/>

	<!-- Meta Tags Generated via https://www.opengraph.xyz -->
</svelte:head>

{@render children?.()}
