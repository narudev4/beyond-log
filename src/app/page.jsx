export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">Hello, Tailwind + Next.js!</h1>
			<a href="/deck">デッキを登録する</a><br />
			<a href="/self">自走</a>
    </main>
  );
}