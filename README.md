Nodebb-Plugin-Category-Sort-By-Votes
------------------------------------

### Usage
* Install it from NodeBB Admin Panel, or
```
npm install nodebb-plugin-category-sort-by-votes
```
* Run nodebb
```
./nodebb start
```
* Activate plugin in admin page

* Reindex
Go to http://localhost:4567/admin/plugins/category-sort-by-votes and click `Re Index`.
You can see the indexing info in that page.

* Then it is done and you are happy

### Notes
Feature of sorting by votes use `cid:[cid]:tids:votes` as key, while it is not supported by NodeBB.So we must recreate the index to make it work.
If "reindex" is not applied before you use "Sort By Votes" option in the category page, the category page will be blank.

We also use `action:post.downvote`, `action:post.unvote`, `action:post.upvote` hook to listen user actions and dynamically update the sortedSet which use `cid:[cid]:tids:votes` as key.