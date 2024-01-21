import { IgApiClient, UserFeedResponseItemsItem } from 'instagram-private-api';
import { AccountRepositoryLoginResponseLogged_in_user } from 'instagram-private-api/dist/responses';

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
const ig = new IgApiClient();
export class Instagram {
  static user;
  static state;
  static generateState(nameAccount: string) {
    if (Instagram.state) {
      return Instagram.state;
    } else {
      Instagram.state = ig.state.generateDevice(nameAccount);
    }
  }

  static async login(
    username: string,
    password: string,
  ): Promise<string | AccountRepositoryLoginResponseLogged_in_user> {
    try {
      if (Instagram.user) {
        return Instagram.user;
      } else {
        try {
          Instagram.user = await ig.account.login('tr14.88', '081917vLl*');
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log('Error: ', e);
    }
    if (Instagram.user) {
      return Instagram.user;
    } else {
      return 'ERROR WHILE LOGIN';
    }
  }

  static async searchUser(username: string) {
    let userSearchedPK;
    try {
      userSearchedPK = await ig.user.searchExact(username);
    } catch (e) {
      console.log('Error: USER put unexpected name');
    }
    if (userSearchedPK?.friendship_status?.is_private) {
      return 'ERROR_PRIVATE';
    }
    if (userSearchedPK) {
      return userSearchedPK;
    } else {
      return 'ERROR WHILE SEARCHING USER';
    }
  }

  static async getImageProfile(username: string) {
    try {
      const user = await ig.user.searchExact(username);
      if (user) {
        if (user.profile_pic_url) {
          return user.profile_pic_url;
        } else {
          return 'NO_PICTURE';
        }
      }
    } catch (e) {
      console.log('Error while try to find user or image profile');
    }
  }

  static async getPost(
    username: string,
    postNumber: number = 0,
  ): Promise<string | UserFeedResponseItemsItem> {
    try {
      const user = await ig.user.searchExact(username);
      if (user) {
        const feed = ig.feed.user(user.pk);
        const posts = await feed.items();
        if (posts[postNumber]) {
          return posts[postNumber];
        } else {
          return 'NO_POSTS';
        }
      }
    } catch (e) {
      console.log('Error while try to find user or image profile');
    }
  }
}
