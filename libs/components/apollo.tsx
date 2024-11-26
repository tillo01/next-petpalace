import { useApolloClient } from '@apollo/client';
import React from 'react';

function ClearCacheButton() {
	const client = useApolloClient();

	const handleClearCache = async () => {
		await client.clearStore();
		console.log('Apollo cache cleared.');
	};

	return <button onClick={handleClearCache}>Clear Apollo Cache</button>;
}

export default ClearCacheButton;
