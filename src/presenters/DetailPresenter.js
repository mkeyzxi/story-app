import StoryModel from "../models/StoryModel.js";
import AuthModel from "../models/AuthModel.js";

export default class DetailPresenter {
  constructor(view, storyId) {
    this.view = view;
    this.storyId = storyId;
    this.storyModel = new StoryModel();
    this.authModel = new AuthModel();

    this.init();
  }

  async init() {
    const token = this.authModel.getToken();

    if (!token) {
      this.view.triggerRedirect();
      return;
    }

    try {
      const story = await this.storyModel.getStoryById(this.storyId, token);
      this.view.renderStory(story);
    } catch (error) {
      this.view.renderError(error.message);
    }
  }
}
