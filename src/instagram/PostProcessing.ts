var moment = require('moment');
import { UserFeedResponseItemsItem } from 'instagram-private-api';
export class PostProcessing {
  static generatePost(post: UserFeedResponseItemsItem) {
    return {
      photo: PostProcessing.getPhotoPost(post),
      date: PostProcessing.getDatePost(post.taken_at),
      desc: PostProcessing.getDescPost(post),
    };
  }

  static getPhotoPost(post: UserFeedResponseItemsItem) {
    if (post?.carousel_media) {
      const links: string[] = [];
      for (let item of post.carousel_media) {
        links.push(item.image_versions2.candidates[0].url);
      }
      return links;
    } else {
      return post?.image_versions2?.candidates[0]?.url || 'No photo';
    }
  }

  static getDatePost(postDate: number) {
    return moment(postDate).format('dddd, MMMM Do YYYY, h:mm:ss a');
  }

  static getDescPost(post: UserFeedResponseItemsItem) {
    return post?.caption?.text || 'No description';
  }
}
