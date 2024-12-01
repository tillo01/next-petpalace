import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/petPalace.png" />

				{/* SEO */}
				<meta name="keyword" content={'petpalace, petpalace.uz'} />
				<meta
					name={'description'}
					content={
						'Buy and sell pets anywhere anytime in Japan. Best pets at the best prices on petpalace.uz | ' +
						'Покупайте и продавайте домашних животных в любой точке Японии в любое время. Лучшие питомцы по лучшим ценам на petpalace.jp | ' +
						'일본 어디서나 언제든지 애완동물을 사고팔 수 있습니다. petpalace.jp 최고의 가격으로 최고의 애완동물을 만나보세요.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
