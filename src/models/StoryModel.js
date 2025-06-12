export default class StoryModel {
  getToken() {
    return localStorage.getItem("token");
  }

  async getAllStories(token) {
    try {
      const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async addNewStory(formData, token) {
    try {
      const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async getStoryById(id, token) {
    const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal mengambil data detail");
    return data.story;
  }
}
