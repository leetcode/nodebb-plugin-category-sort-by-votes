Nodebb-Plugin-Category-Sort-By-Votes
------------------------------------

[![License](https://img.shields.io/npm/l/nodebb-plugin-category-sort-by-votes.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/nodebb-plugin-category-sort-by-votes.svg)](https://www.npmjs.com/package/nodebb-plugin-category-sort-by-votes)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-category-sort-by-votes.svg)](https://www.npmjs.com/package/nodebb-plugin-category-sort-by-votes)


Adds ability to sort topic by votes within a category to your NodeBB.

![image](https://cloud.githubusercontent.com/assets/2770875/16077770/b98ad47c-32af-11e6-8a96-bfee20cac031.png)


### Installation

* Install it from NodeBB Admin Panel, or

        npm install nodebb-plugin-category-sort-by-votes

### Usage

1. Go to the ACP (Admin Control Panel).
2. Activate plugin and reload NodeBB.
3. Click Plugins -> Category Sort to go to the Plugin's settings.
4. Click "Re Index" to index all topics (see below screenshot).

  ![image](https://cloud.githubusercontent.com/assets/2770875/16077618/dfba1410-32ae-11e6-96d0-1daf6ffd2ee3.png)

5. Go to any category, select "Most votes" from the "Sort by" dropdown and it should work!

### Notes
Feature of sorting by votes use `cid:[cid]:tids:votes` as key, while it is not supported by NodeBB.So we must recreate the index to make it work.
If "reindex" is not applied before you use "Sort By Votes" option in the category page, the category page will be blank.

We also use `action:post.downvote`, `action:post.unvote`, `action:post.upvote` hook to listen user actions and dynamically update the sortedSet which use `cid:[cid]:tids:votes` as key.
