export default class StoryModel {
  getToken() {
    return localStorage.getItem("token");
  }

  async getAllStories(token) {
    try {
      const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal mengambil data");

      return data;
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
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal menambahkan cerita");

      return data;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async getStoryById(id, token) {
  try {
    const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.message || "Gagal mengambil data detail");
    }

    return data.story;
  } catch (error) {
    throw new Error(error.message || "Gagal mengambil data detail");
  }
}
}
