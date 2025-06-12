export default function StoryItem(story) {
  return `
    <article class="border rounded-lg overflow-hidden shadow bg-white">
      <img src="${story.photoUrl}" alt="Story by ${story.name}" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h2 class="font-semibold">${story.name}</h2>
        <p class="text-sm text-gray-600">${story.description}</p>
      </div>
    </article>
  `;
}
